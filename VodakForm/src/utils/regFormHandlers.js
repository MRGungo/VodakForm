import { get } from 'svelte/store';
import {username, isSwimmer, friendNick, sClass, usernameUnique, email, password, confPassword, emailUnique} from '../stores.js'
import {validateUsername,validateEmail, validatePassword} from "./validation.js";



export async function checkEmailUniqueness(email) {
    if (!validateEmail(email)) {
        emailUnique.set(false);
        return;
    }
    try {
        const response = await fetch(`/registrace/email-check?email=${encodeURIComponent(email.toLowerCase().trim())}`);
        emailUnique.set(response.ok); // If the status is 200, the email is unique
    } catch (error) {
        console.error('Error checking email uniqueness', error);
    }
}



/**
 * @param {string} username
 */
export async function checkUsernameUniqueness(username) {
    if (!validateUsername(username)) {
        usernameUnique.set(false);
        return;
    }
    try {
        const response = await fetch(`/registrace/username-check?username=${encodeURIComponent(username.toLowerCase().trim())}`);
        usernameUnique.set(response.ok); // If the status is 200, the username is unique
    } catch (error) {
        console.error('Error checking username uniqueness', error);
    }


    // Only run the AJAX call if we are in the browser
}
// Function to handle the form submission
/**
 * @param {{ username: string; isSwimmer: string; sClass: string; email: string; password: string; friendNick: string | null; // Optional field
 }} formData
 */
async function submitData(formData) {
    try {
        const response = await fetch('/registrace/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        return await response.json(); // or handle the response as needed
    } catch (error) {
        console.error('Submission error:', error);
        alert('Došlo k chybě.');
    }
}

// Adjusted function to handle the form submission
export async function regSubmitForm() {
    const currentUsername = get(username);
    const currentFriendNick = get(friendNick);
    const currentEmail = get(email);
    const currentPassword = get(password);
    const currentConfPassword = get(confPassword);
    const currentIsSwimmer = get(isSwimmer);
    const currentSClass = get(sClass);
    const currentUsernameUnique = get(usernameUnique);
    const currentEmailUnique = get(emailUnique);


    if (!validateUsername(currentUsername) || !(validateUsername(currentFriendNick) || currentFriendNick === '')) {
        alert('Vstupní udáje nejsou validní');
        return false;
    }
    if (currentFriendNick === currentUsername) {
        alert('Prezdívka nesmí být stejná jako Kamarád na lodi')
        return false
    }

    if (!currentUsernameUnique) {
        alert('Přezdívku už nekdo má.');
        return false;
    }
    if (!validateEmail(currentEmail)) {
        alert("Email není validní")
    }
    if (!currentEmailUnique) {
        alert('Email už nekdo má.');
        return false;
    }
    if (!currentIsSwimmer) {
        alert('Musíte umět plavat');
        return false;
    }
    if (!validatePassword(currentPassword)){
        alert('Heslo nesplňuje požadavky')
    }

    if (currentPassword !== currentConfPassword){
        alert('Kontrola hesla se nerovna heslu')
        return false
    }
    // Construct the form data object
    const formData = {
        username: currentUsername,
        isSwimmer: currentIsSwimmer,
        sClass: currentSClass,
        email: currentEmail,
        password: currentPassword,
        friendNick: currentFriendNick || null  // Optional field
    };
    // Submit the form data
    const result = await submitData(formData);
    if (result && result.success) {
        alert('Registrace Úspěšná');
        // Optionally reset the form or redirect the user
        window.history.back()
    } else {
        alert('Registrace se nepovedla. Prosím zkuste znovu');
    }
}

