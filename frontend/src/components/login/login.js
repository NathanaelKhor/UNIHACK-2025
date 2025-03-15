// JavaScript for Login Form Validation and Handling
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting immediately

    // Get values from the form
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple validation: Check if both fields are filled
    if (username === '' || password === '') {
        alert('Please fill in both username and password.');
        return;
    }

    // For demonstration, you can add any logic for successful login here
    // For example, check if the username and password match a certain condition (hardcoded example)
    if (username === 'admin' && password === '') {
        alert('Login successful!');
        // Redirect to a new page or perform other actions
        // window.location.href = 'dashboard.html'; // Uncomment to redirect to another page
    } else {
        alert('Incorrect username or password.');
    }
});
