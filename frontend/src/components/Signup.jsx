import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [message, setMessage] = useState('');
    const [variant, setVariant] = useState('danger');
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [emailExists, setEmailExists] = useState(false); // New state to track if email already exists
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validatePassword = (password) => {
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
        if (!pattern.test(password)) {
            setPasswordError("Password must be at least 8 characters, including uppercase, lowercase, number, and special character.");
        } else {
            setPasswordError('');
        }
        return pattern.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { firstName, lastName, email, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            setVariant("danger");
            return;
        }

        if (!validatePassword(password)) {
            setMessage("Password must meet the required format.");
            setVariant("danger");
            return;
        }
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        // Check if email already exists
        try {
            const emailCheckRes = await axios.post(`${backendUrl}/api/auth/check-email`, { email });
            if (emailCheckRes.data.exists) {
                setEmailExists(true);
                setMessage("Email already exists. Please use a different email.");
                setVariant("danger");
                return;
            }
        } catch (err) {
            console.error("Error checking email: ", err);
        }

        setLoading(true);

        try {
            const res = await axios.post(`${backendUrl}/api/auth/signup`, {
                firstName,
                lastName,
                email,
                password,
            });

            setMessage("Signup successful! Redirecting...");
            setVariant("success");
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || "Signup failed. Please try again.";
            setMessage(errorMsg);
            setVariant("danger");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-wrapper">
            <div className="signup-left">
                <div className="signup-form">
                    <h2>Sign Up</h2>

                    {message && <div className={`alert alert-${variant}`}>{message}</div>}

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            className={`form-control ${emailExists ? 'is-invalid' : ''}`} // Highlight if email exists
                            placeholder="Email Address"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {emailExists && <div className="invalid-feedback">Email already exists. Please use a different email.</div>} {/* Show error if email exists */}

                        <input
                            type="password"
                            className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                    </form>

                    <div className="or-divider">OR</div>
                    {/* Google Sign-Up Button */}
                    <button className="btn btn-danger w-100 google-btn">
                        <i className="fab fa-google"></i> Sign Up with Google
                    </button>

                    <div className="terms">
                        By signing up, you agree to our <a href="#">Terms of Service</a>.
                    </div>

                    <div className="login-link">
                        Already a member? <a href="/login">Login</a>
                    </div>
                </div>
            </div>

            {/* Updated part with a single image container */}
            <div className="signup-right">
                <img
                    src="https://plus.unsplash.com/premium_photo-1683984171269-04c84ee23234?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="signup"
                />
            </div>
        </div>
    );
};

export default Signup;
