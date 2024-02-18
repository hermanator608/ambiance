import React, { useEffect } from "react";
import { User, UserCredential, getAuth, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom'


interface AuthContextType {
  /**
   * Either an active current user, null if the user is signed out, or undefined if we're waiting for firebase response
   */
  currentUser?: User | null;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const firebaseAuth = getAuth();
  //Either an active current user, null if the user is signed out, or undefined if we're waiting for firebase response
  let [currentUser, setCurrentUser] = React.useState<User | null | undefined>(firebaseAuth.currentUser || undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    })

    return () => {
      unsubscribe();
    }
  }, [setCurrentUser, firebaseAuth, navigate])


  const signIn = async (username: string, password: string) => {
    return signInWithEmailAndPassword(firebaseAuth, username, password)
      .then((userCredential: UserCredential) => {
        // Signed in
        setCurrentUser(userCredential.user);
      })
      .catch((error: any) => {
        console.error(error.code);
        console.error(error.message);

        // Throw again so caller can handle as they see fit
        throw error;
      });
  };

  const signOut = async () => {
    return firebaseSignOut(firebaseAuth)
      .then(() => {
        //Signed out
        setCurrentUser(null);

      }).catch((error) => {
        console.error(error.code);
        console.error(error.message);

        // Throw again so caller can handle as they see fit
        throw error;
      })
  };

  const contextValue: AuthContextType = { currentUser, signIn, signOut };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}