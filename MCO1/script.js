document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const reservationForm = document.getElementById('reservation-form');
    const searchForm = document.getElementById('search-form');
    const labSelect = document.getElementById('lab-select');
    const profilePicture = document.getElementById('profile-picture');
    const userName = document.getElementById('user-name');
    const userDescription = document.getElementById('user-description');
    const userReservations = document.getElementById('user-reservations');
    const availabilityDiv = document.getElementById('availability');
    const searchResults = document.getElementById('search-results');

    // newly added elements by nathan
    const seatSelect = document.getElementById('seat');
    const labFormSelect = document.getElementById('lab');
    const deleteAccountButton = document.getElementById('delete-account');
    const logoutButton = document.getElementById('logout-button');
    
    // Initial Data
    const initialUsers = [
        { id: 1, email: 'student1@dlsu.edu', password: 'password1', role: 'student', profile: { picture: 'images/default-profile.png', description: 'Student 1' }, reservations: [] },
        { id: 2, email: 'student2@dlsu.edu', password: 'password2', role: 'student', profile: { picture: 'images/default-profile.png', description: 'Student 2' }, reservations: [] },
        { id: 3, email: 'technician1@dlsu.edu', password: 'password3', role: 'technician', profile: { picture: 'images/default-profile.png', description: 'Technician 1' }, reservations: [] }
    ];

    const initialReservations = [
        { id: 1, userId: 1, labId: 1, date: '2024-06-01', time: '09:00', anonymous: false, seatNumber: 1 },
        { id: 2, userId: 2, labId: 2, date: '2024-06-01', time: '10:00', anonymous: true, seatNumber: 2 }
    ];

    const labs = [
        { id: 1, name: 'Lab 1', seats: 10 },
        { id: 2, name: 'Lab 2', seats: 8 },
        { id: 3, name: 'Lab 3', seats: 12 }
    ];

    // Load Data from Local Storage or Initialize
    let users = JSON.parse(localStorage.getItem('users')) || initialUsers;
    let reservations = JSON.parse(localStorage.getItem('reservations')) || initialReservations;
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Save Data to Local Storage
    function saveData() {
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('reservations', JSON.stringify(reservations));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    // Logout Function
    function logout() {
        // Clear session-related data
        localStorage.removeItem('currentUser');
        currentUser = null;
        // Redirect to the login page
        window.location.href = 'login.html';
    }

    // Load Labs into Select Element
    function loadLabs() {
        [labSelect, labFormSelect].forEach(selectElement => {
            if (selectElement) {
                selectElement.innerHTML = '';
                labs.forEach(lab => {
                    const option = document.createElement('option');
                    option.value = lab.id;
                    option.textContent = lab.name;
                    selectElement.appendChild(option);
                });
            }
        });
    }

    // Load Seats into Seat Select Element
    function loadSeats(labId) {
        if (seatSelect) {
            seatSelect.innerHTML = '';
            const lab = labs.find(l => l.id == labId);
            for (let i = 1; i <= lab.seats; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `Seat ${i}`;
                seatSelect.appendChild(option);
            }
        }
    }

    // Function to delete the user's account
    function deleteUserAccount() {
        users = users.filter(user => user.id !== currentUser.id);
        reservations = reservations.filter(reservation => reservation.userId !== currentUser.id);

        saveData();

        alert('Your account has been successfully deleted.');
        window.location.href = 'index.html';
    }

    // Display Availability for Selected Lab
    function displayAvailability(labId) {
        if (availabilityDiv) {
            availabilityDiv.innerHTML = '';
            const lab = labs.find(l => l.id == labId);
            const labReservations = reservations.filter(r => r.labId == labId);
            for (let i = 1; i <= lab.seats; i++) {
                const seatReservations = labReservations.filter(r => r.seatNumber == i);
                const seatDiv = document.createElement('div');
                seatDiv.textContent = `Seat ${i}: ${seatReservations.length ? 'Reserved' : 'Available'}`;
                availabilityDiv.appendChild(seatDiv);
            }
        }
    }

    // Event Listeners
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            logout();
        });
    }

    // Load user reservations
    function loadUserReservations() {
        if (userReservations) {
            userReservations.innerHTML = '';
            const userReservationsList = reservations.filter(r => r.userId === currentUser.id);
            userReservationsList.forEach(reservation => {
                const li = document.createElement('li');
                const labName = labs.find(l => l.id == reservation.labId).name;
                li.innerHTML = `Lab: ${labName}, Seat: ${reservation.seatNumber}, Date: ${reservation.date}, Time: ${reservation.time} 
                    <button id="remove-${reservation.id}">Remove reservation</button>`;
                
                userReservations.appendChild(li);

                const removeButton = document.getElementById(`remove-${reservation.id}`);
                removeButton.addEventListener('click', function () {
                    removeReservation(reservation.id);
                });
            });
        }
    }

    // Function to remove reservation within 10 minutes of the reservation time
    function removeReservation(reservationId) {
        const reservation = reservations.find(r => r.id === reservationId);
        if (!reservation) return;

        const reservationTime = new Date(`${reservation.date}T${reservation.time}:00`);
        const currentTime = new Date();

        const timeDifference = (reservationTime - currentTime) / (1000 * 60); // Difference in minutes

        if (timeDifference <= 10 && timeDifference >= 0) {
            reservations = reservations.filter(r => r.id !== reservationId);
            saveData();
            loadUserReservations();
            alert('Reservation successfully removed.');
        } else {
            alert('Reservations can only be removed within 10 minutes of the reservation time.');
        }
    }

    // Show the edit profile form when "Edit Profile" button is clicked
    if (editProfileButton) {
        editProfileButton.addEventListener('click', function () {
            editProfileSection.style.display = 'block';
        });
    }

    // Hide the edit profile form when "Cancel" button is clicked
    if (cancelEditButton) {
        cancelEditButton.addEventListener('click', function () {

            editProfileSection.style.display = 'none';
        });
    }

    /* When the user clicks on the button,
    toggle between hiding and showing the dropdown content */
    if (dropDownButton) {
        dropDownButton.addEventListener('click', function () {
            document.getElementById("myDropdown").classList.toggle("show");
        });
      }

    // Close the dropdown if the user clicks outside of it
    window.onclick = function(event) {
        if (!event.target.matches('.dropbtn')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }

    // Handle form submission (for saving changes)
    const editProfileForm = document.getElementById('edit-profile-form');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const newProfilePictureInput = document.getElementById('new-profile-picture');
            const newUserNameInput = document.getElementById('new-user-name');
            const newUserDescriptionInput = document.getElementById('new-user-description');

            // Update profile picture if a new one is provided
            if (newProfilePictureInput.files.length > 0) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    currentUser.profile.picture = event.target.result;
                    document.getElementById('profile-picture').src = event.target.result;
                    saveData();
                };
                reader.readAsDataURL(newProfilePictureInput.files[0]);
            }

            // Update username if a new one is provided
            if (newUserNameInput.value.trim() !== '') {
                currentUser.email = newUserNameInput.value.trim();
                document.getElementById('user-name').textContent = currentUser.email;
            }

            // Update description if a new one is provided
            if (newUserDescriptionInput.value.trim() !== '') {
                currentUser.profile.description = newUserDescriptionInput.value.trim();
                document.getElementById('user-description').textContent = currentUser.profile.description;
            }

            saveData();
            editProfileSection.style.display = 'none';  // Hide the form after saving
        });
    }

    // Event Listeners for other forms
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;
            const remember = loginForm.remember.checked;

            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                currentUser = user;
                if (remember) {
                    currentUser.remember = true;
                    currentUser.rememberUntil = new Date(new Date().getTime() + 3 * 7 * 24 * 60 * 60 * 1000);
                }
                saveData();
                window.location.href = 'lab_availability.html';
            } else {
                alert('Invalid credentials');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = registerForm.email.value;
            const password = registerForm.password.value;
            const role = registerForm.role.value;

            if (users.find(u => u.email === email)) {
                alert('User already exists');
            } else {
                const newUser = { id: Date.now(), email, password, role, profile: { picture: 'images/default-profile.png', description: '' }, reservations: [] };
                users.push(newUser);
                saveData();
                alert('Registration successful');
                window.location.href = 'login.html';
            }
        });
    }

    if (reservationForm) {
        reservationForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const labId = reservationForm.lab.value;
            const date = reservationForm.date.value;
            const time = reservationForm.time.value;
            const anonymous = reservationForm.anonymous.checked;
            const seatNumber = parseInt(document.getElementById('seat').value);

            const reservation = {
                id: Date.now(),
                userId: currentUser.id,
                labId: parseInt(labId),
                date,
                time,
                anonymous,
                seatNumber: Math.floor(Math.random() * labs.find(l => l.id == labId).seats) + 1 // Random seat number for simplicity
            };

            reservations.push(reservation);
            saveData();
            alert('Reservation successful');
            window.location.href = 'profile.html';
        });
    }

    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const search = searchForm.search.value.toLowerCase();
            const results = users.filter(u => u.email.toLowerCase().includes(search));
            searchResults.innerHTML = '';
            results.forEach(user => {
                const li = document.createElement('li');
                li.textContent = user.email;
                searchResults.appendChild(li);
            });
        });
    }

    if (currentUser) {
        if (profilePicture) profilePicture.src = currentUser.profile.picture;
        if (userName) userName.textContent = currentUser.email;
        if (userDescription) userDescription.textContent = currentUser.profile.description;

        if (userReservations) {
            userReservations.innerHTML = '';
            const userReservationsList = reservations.filter(r => r.userId === currentUser.id);
            userReservationsList.forEach(reservation => {
                const li = document.createElement('li');
                li.textContent = `Lab: ${labs.find(l => l.id == reservation.labId).name}, Seat: ${reservation.seatNumber}, Date: ${reservation.date}, Time: ${reservation.time}`;
                userReservations.appendChild(li);
            });
        }
    }

    if (labSelect) {
        labSelect.addEventListener('change', function () {
            const selectedLabId = parseInt(labSelect.value);
            displayAvailability(selectedLabId);
            loadSeats(selectedLabId); // Load seats for the selected lab
        });
    }

    // Event listener for the delete account button
    if (deleteAccountButton) {
        deleteAccountButton.addEventListener('click', function() {
            // Show confirmation prompt
            const confirmDelete = confirm('Are you sure you want to delete your account? This action cannot be undone.');

            // If user confirms deletion, call deleteUserAccount function
            if (confirmDelete) {
                deleteUserAccount();
            }
        });
    }

    // Initial Data Load
    loadLabs();
    if (labSelect) {
        displayAvailability(parseInt(labSelect.value));
    }

    // Save initial data if it doesn't exist
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(initialUsers));
    }
    if (!localStorage.getItem('reservations')) {
        localStorage.setItem('reservations', JSON.stringify(initialReservations));
    }
});
