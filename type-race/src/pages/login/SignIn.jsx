// import { signInWithPopup, signOut } from "firebase/auth";
// import React, { useContext, useEffect } from "react";
// import { auth, googleProvider } from "../../config/firebase";
// import { UserContext } from "../../helper/context";

// function SignIn() {
//   const { user, setUser } = useContext(UserContext);

//   useEffect(() => {
//     getLoggedUser();
//   }, [user]);
//   const getLoggedUser = () => {
//     const userData = auth?.currentUser;
//     setUser(auth?.currentUser);
//     console.log(user);
//   };
//   const signInWithGoogle = async () => {
//     try {
//       await signInWithPopup(auth, googleProvider).then((res) => {
//         setUser(res.user)
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const logOut = async () => {
//     try {
//       await signOut(auth).then((res) => {
//         console.log(res);
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={signInWithGoogle}>Sign in with google</button>
//       <button onClick={logOut}>Logout</button>
//     </div>
//   );
// }

// export default SignIn;
