import { writable } from 'svelte/store';
import {  onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.js';

// Store para manejar el usuario autenticado
export const user = writable(null);

// Establece el usuario cuando el estado de autenticación cambia
    onAuthStateChanged(auth, (currentUser) => {
        user.set(currentUser);
    });

