import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'owner' | 'member';
  institutionId?: string;
  institutionName?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  institutionName: string | null;
  setInstitutionInfo: (name: string, address: string, type: string) => Promise<string>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  profile: null, 
  loading: true,
  institutionName: null,
  setInstitutionInfo: async () => '',
  logout: async () => {} 
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [institutionName, setInstName] = useState<string | null>(() => localStorage.getItem('em_inst_name'));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (profileDoc.exists()) {
            const data = profileDoc.data() as UserProfile;
            setProfile(data);
            if (data.institutionName) {
              setInstName(data.institutionName);
              localStorage.setItem('em_inst_name', data.institutionName);
            }
            if (data.institutionId) {
              localStorage.setItem('em_inst_id', data.institutionId);
            }
          } else {
            // Initialize basic profile for authenticated Google user
            const savedInstName = localStorage.getItem('em_inst_name') || 'Instansi Terdaftar';
            const savedInstId = localStorage.getItem('em_inst_id') || `inst_${firebaseUser.uid}`;
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'User',
              photoURL: firebaseUser.photoURL || undefined,
              role: 'owner',
              institutionId: savedInstId,
              institutionName: savedInstName
            };
            setProfile(newProfile);
            try {
              await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
            } catch (err) {
              console.warn("Notice saving initial profile to cloud:", err);
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        // Not logged into Firebase with Google, check for local session
        const savedName = localStorage.getItem('em_inst_name');
        const savedId = localStorage.getItem('em_inst_id');
        const savedUid = localStorage.getItem('em_user_id') || `guest_${Date.now()}`;
        
        if (savedName) {
          setInstName(savedName);
          setProfile({
            uid: savedUid,
            email: 'guest@emissioculator.local',
            displayName: savedName,
            role: 'owner',
            institutionId: savedId || `inst_${savedUid}`,
            institutionName: savedName
          });
        } else {
          setProfile(null);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const setInstitutionInfo = async (name: string, address: string, type: string): Promise<string> => {
    const cleanName = name.trim();
    const cleanAddress = address.trim();
    const instType = type || 'School';

    let instId = localStorage.getItem('em_inst_id');
    let uid = user?.uid || localStorage.getItem('em_user_id');

    if (!uid) {
      uid = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      localStorage.setItem('em_user_id', uid);
    }

    if (!instId) {
      instId = `inst_${Date.now()}_${uid.substring(0, 8)}`;
      localStorage.setItem('em_inst_id', instId);
    }

    localStorage.setItem('em_inst_name', cleanName);
    localStorage.setItem('em_inst_address', cleanAddress);
    localStorage.setItem('em_inst_type', instType);
    setInstName(cleanName);

    const updatedProfile: UserProfile = {
      uid,
      email: user?.email || `guest_${uid}@emissioculator.local`,
      displayName: user?.displayName || cleanName,
      photoURL: user?.photoURL || undefined,
      role: 'owner',
      institutionId: instId,
      institutionName: cleanName
    };
    setProfile(updatedProfile);

    // If Firebase user is signed in, sync institution & profile to Firestore
    if (user && db) {
      try {
        await setDoc(doc(db, 'institutions', instId), {
          name: cleanName,
          placeId: instId,
          address: cleanAddress,
          ownerId: user.uid,
          ownerEmail: user.email || '',
          type: instType,
          verified: false,
          createdAt: new Date().toISOString()
        });

        await setDoc(doc(db, 'users', user.uid), updatedProfile);
      } catch (err) {
        console.warn("Notice: Firestore sync for institution deferred:", err);
      }
    }

    return instId;
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Logout error:", e);
    }
    setUser(null);
    setProfile(null);
    setInstName(null);
    localStorage.removeItem('em_inst_name');
    localStorage.removeItem('em_inst_id');
    localStorage.removeItem('em_inst_address');
    localStorage.removeItem('em_inst_type');
    localStorage.removeItem('em_user_id');
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, institutionName, setInstitutionInfo, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
