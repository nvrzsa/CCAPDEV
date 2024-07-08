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
    const editProfileButton = document.getElementById('edit-profile');
    const editProfileSection = document.getElementById('edit-profile-section');
    const cancelEditButton = document.getElementById('cancel-edit');
    const dropDownButton = document.getElementById('dropDown-Button');

    // newly added elements by nathan
    const seatSelect = document.getElementById('seat');
    const labFormSelect = document.getElementById('lab');
    const deleteAccountButton = document.getElementById('delete-account');

  
    //newly added elements by brian
    const selectTimeSlotSelect = document.getElementById("lab-timeslot-select");
    const checkAvailabilityBtn = document.getElementById("check-available-slots-btn");
    const checkAvailableSection = document.getElementById("check-avalable-section");
    const row1 = document.getElementById('lab-availability-dv1');
    const row2 = document.getElementById('lab-availability-dv2');
    const row3 = document.getElementById('lab-availability-dv3');


    // newly added elements by kain
    const modal = document.getElementById('user-info-modal');
    const modalClose = document.querySelector('.modal .close');
    const modalProfilePicture = document.getElementById('modal-profile-picture');
    const modalUserName = document.getElementById('modal-user-name');
    const modalUserDescription = document.getElementById('modal-user-description');
    const modalUserReservations = document.getElementById('modal-user-reservations');
    const submitEditButton = document.getElementById('submit-edit');
    const logoutButton = document.getElementById('logout-button');
    
    // Initial Data
    const initialUsers = [
        { id: 1, email: 'student1@dlsu.edu', password: 'password1', role: 'student', profile: { picture: 'images/default-profile.png', description: 'Student 1' }, reservations: [] },
        { id: 2, email: 'student2@dlsu.edu', password: 'password2', role: 'student', profile: { picture: 'images/default-profile2.jpeg', description: 'Student 2' }, reservations: [] },
        { id: 3, email: 'technician1@dlsu.edu', password: 'password3', role: 'technician', profile: { picture: 'images/default-profile.png', description: 'Technician 1' }, reservations: [] }
    ];

    const initialReservations = [
        { id: 1, userId: 1, labId: 1, date: '2024-06-11', time: '09:00', anonymous: false, seatNumber: 1 },
        { id: 2, userId: 2, labId: 2, date: '2024-06-11', time: '10:30', anonymous: true, seatNumber: 2 },
        { id: 3, userId: 1, labId: 1, date: '2024-06-11', time: '09:00', anonymous: false, seatNumber: 4 }
    ];

    const labs = [
        // add an array reservations attribute -- automatically populate object + array
        { id: 1, name: 'Lab 1', seats: 10, reservations: {} },
        { id: 2, name: 'Lab 2', seats: 8, reservations: {} },
        { id: 3, name: 'Lab 3', seats: 12, reservations: {} }
    ];

    const timeslots = [
        '09:00', '10:30', '12:00', '1:30', '3:00', '4:30'
    ]

    //reservations can only be made one week in advance
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]


    //populate weekly schedule for labs
    function populateLabSchedule() {
        labs.forEach((lab) => {
            days.forEach((day) => {
                lab.reservations[day] = []
                timeslots.forEach((time) => {
                    lab.reservations[day][time] = new Array(lab.seats)
                })
            })
            console.log(lab)
        })
    }

    //assign all reserved slots of timeslot of day
    function setReserved() {
        initialReservations.forEach((reservation) => {
            var setDate = new Date(reservation.date)
            var dayy = setDate.getDay()
            labs[reservation.labId - 1].reservations[days[dayy - 1]][reservation.time][reservation.seatNumber - 1] = true
        })
    }

    //check available slots
    function checkAvailableSlots(day, time) {
        var setDate = new Date(day)
        var dayy = setDate.getDay()
        labs.forEach((lab) => {
            var labNum = lab.id
            for (let i = 0; i < lab.seats; i++) {
                var div = document.getElementById(`lab-availability-dv${labNum}`)
                if (lab.reservations[days[dayy - 1]][time][i] != true) {
                    let available = document.createElement('p');
                    available.value = i;
                    available.innerHTML = `seat ${i + 1}`;
                    console.log(lab.id, `seat ${i + 1}`)
                    switch (lab.id) {
                        case 1:
                            row1.append(available);
                            break;
                        case 2:
                            row2.append(available);
                            break;
                        case 3:
                            row3.append(available);
                            break;
                    }
                }
            }

        })
    }

    //populate select for time in view reservation slots
    function populateSelectLabSchedule() {
        timeslots.map((time) => {
            let option = document.createElement("option");
            option.value = time; // the index
            option.innerHTML = time;
            selectTimeSlotSelect.append(option);
        });
    }

    //populate the header element of the divs for viewing of slots
    //temporary fix 
    function populateAvailabilityDivs() {
        if (!row1.querySelector('h4')) {
            var head1 = document.createElement('h4');
            head1.innerHTML = "Lab 1";
            row1.append(head1);
        }
        if (!row2.querySelector('h4')) {
            var head2 = document.createElement('h4');
            head2.innerHTML = "Lab 2";
            row2.append(head2);
        }
        if (!row3.querySelector('h4')) {
            var head3 = document.createElement('h4');
            head3.innerHTML = "Lab 3";
            row3.append(head3);
        }
    }

    //funtionality of check availability button
    if (checkAvailabilityBtn) {
        checkAvailabilityBtn.addEventListener("click", function () {
            var time = document.getElementById("lab-timeslot-select")
            var date = document.getElementById("lab-date-select")
            row1.innerHTML = '';
            row2.innerHTML = '';
            row3.innerHTML = '';
            populateAvailabilityDivs();
            checkAvailableSlots(date.value, time.value)
        })
    }

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

    // new new kian - I updated this segment, so the first instance will alawys have the seats options
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

                    loadSeats(lab.id);// this is what was

                });
            }
        });
    }

    // new new kian -- added back the function
    loadLabs();
    
    if (labSelect) {
        displayAvailability(parseInt(labSelect.value));
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
                const newUser = { id: Date.now(), email, password, role, profile: { picture: 'images/default-profile.png', description: 'New user' }, reservations: [] };
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
                seatNumber: seatNumber // new new kian, fixed the seats
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
        deleteAccountButton.addEventListener('click', function () {
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
    populateLabSchedule();
    setReserved();
    populateSelectLabSchedule();

    if (labSelect) {
        displayAvailability(parseInt(labSelect.value));
    }

    if (currentUser) {
        loadUserReservations();
    }

    // Save initial data if it doesn't exist
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(initialUsers));
    }
    if (!localStorage.getItem('reservations')) {
        localStorage.setItem('reservations', JSON.stringify(initialReservations));
    }

    //new new add by kian -- added the showmodal (info of searched person)

    // Function to populate dropdown with available user emails
    function populateDropdown() {
        const dropdownContent = document.getElementById('myDropdown');
        if (dropdownContent) {
            dropdownContent.innerHTML = ''; // Clear existing dropdown items

            const availableUsers = users.filter(user => user.profile.description.trim() !== '');

            availableUsers.forEach(user => {
                const a = document.createElement('a');
                a.href = '#';
                a.textContent = user.email;
                a.addEventListener('click', function () {
                    showModal(user);
                });
                dropdownContent.appendChild(a);
            });
        }
    }

    populateDropdown();

    // Event listener for lab selection change, you can call populateDropdown here or as needed
    if (labSelect) {
        labSelect.addEventListener('change', function () {
            const selectedLabId = parseInt(labSelect.value);
            displayAvailability(selectedLabId);
            loadSeats(selectedLabId); // Load seats for the selected lab
            populateDropdown(); // Update dropdown based on selected lab or any other criteria
        });
    }

    // new new add by kian
    function populateUserInfo() {
        if (currentUser) {
            profilePicture.src = currentUser.profile.picture;
            userName.textContent = currentUser.email;
            userDescription.textContent = currentUser.profile.description;

            // Display User's Reservations
            userReservations.innerHTML = '';
            const userReservationsList = reservations.filter(r => r.userId === currentUser.id);
            userReservationsList.forEach(reservation => {
                const li = document.createElement('li');
                li.textContent = `Lab: ${labs.find(l => l.id == reservation.labId).name}, Seat: ${reservation.seatNumber}, Date: ${reservation.date}, Time: ${reservation.time}`;
                userReservations.appendChild(li);
            });
        }
    }

    // Function to show modal with user information
    function showModal(user) {
        // Populate modal with user data
        const modalProfilePicture = document.getElementById('modal-profile-picture');
        const modalUserName = document.getElementById('modal-user-name');
        const modalUserDescription = document.getElementById('modal-user-description');
        const modalUserReservations = document.getElementById('modal-user-reservations');

        modalProfilePicture.src = user.profile.picture;
        modalUserName.textContent = user.email;
        modalUserDescription.textContent = user.profile.description;

        // Populate reservations
        modalUserReservations.innerHTML = ''; // Clear existing reservations
        const userReservationsList = reservations.filter(r => r.userId === user.id);
        userReservationsList.forEach(reservation => {
            const li = document.createElement('li');
            li.textContent = `Lab: ${labs.find(l => l.id == reservation.labId).name}, Seat: ${reservation.seatNumber}, Date: ${reservation.date}, Time: ${reservation.time}`;
            modalUserReservations.appendChild(li);
        });

        // Show the modal
        const modal = document.getElementById('user-info-modal');
        modal.style.display = 'block';

        // Close the modal when the close button is clicked
        const closeButton = document.querySelector('.modal-content .close');
        closeButton.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        // Close the modal when clicking outside of it
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Event listener to close the modal
    modalClose.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Close the modal when clicking outside of it
    window.addEventListener('click', function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Add event listener to the dropdown button to toggle the dropdown content
    if (dropDownButton) {
        dropDownButton.addEventListener('click', function () {
            const dropdownContent = document.getElementById('myDropdown');
            dropdownContent.classList.toggle('show');
        });
    }

    // Show modal only when user selects a user from the dropdown
    function showModalOnSelect() {
        const dropdownContent = document.getElementById('myDropdown');
        dropdownContent.addEventListener('click', function(event) {
            const selectedUser = event.target.textContent;
            const user = users.find(u => u.email === selectedUser);
            if (user) {
                showModal(user);
            }
        });
    }

    // Function to make reservation (for technicians)
    function makeReservation() {
        // Implement reservation logic for technicians here
    }

    // Function to display technician-specific elements
    function displayTechnicianElements() {
        if (currentUser && currentUser.role === 'technician') {
            // Display technician-specific elements
            const technicianDropdown = document.getElementById('technician-dropdown');
            if (technicianDropdown) {
                technicianDropdown.style.display = 'block'; // Show technician dropdown
            }
        }
    }

    const makeReservationButton = document.getElementById('make-reservation');
    if (makeReservationButton) {
        makeReservationButton.addEventListener('click', makeReservation);
    }

    //new new kian
    // Initial Data Load
    displayTechnicianElements();
    populateUserInfo();
    populateDropdown();
    showModalOnSelect();
});