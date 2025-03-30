import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const eventId = queryParams.get('event');

    // Form fields state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        organization: '',
        membershipType: 'regular',
        event: eventId || '',
        interests: [],
        agreeToTerms: false
    });

    // Error states
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Mock events data for the dropdown
    const events = [
        { id: '1', title: 'Annual Technology Conference' },
        { id: '2', title: 'AI and Ethics Workshop' },
        { id: '3', title: 'Future of Engineering Webinar' },
        { id: '4', title: 'Women in Technology Summit' },
        { id: '5', title: 'Robotics Workshop for Students' },
        { id: '6', title: 'Sustainable Energy Symposium' },
    ];

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            if (name === 'agreeToTerms') {
                setFormData({
                    ...formData,
                    [name]: checked
                });
            } else {
                // Handle interests checkboxes
                const updatedInterests = [...formData.interests];
                if (checked) {
                    updatedInterests.push(value);
                } else {
                    const index = updatedInterests.indexOf(value);
                    if (index > -1) {
                        updatedInterests.splice(index, 1);
                    }
                }
                setFormData({
                    ...formData,
                    interests: updatedInterests
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }

        // Clear error when field is edited
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (formData.phone && !/^\+?[0-9()-\s]+$/.test(formData.phone)) {
            newErrors.phone = 'Phone number format is invalid';
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'You must agree to the terms and conditions';
        }

        return newErrors;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        // Simulate form submission
        console.log('Form submitted:', formData);
        setIsSubmitted(true);
        
        // Reset form after successful submission
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            organization: '',
            membershipType: 'regular',
            event: '',
            interests: [],
            agreeToTerms: false
        });
    };

    return (
        <div className="min-h-screen bg-[#F2F2F2] pt-20 pb-16">
            <div className="container mx-auto px-4">
                <motion.div
                    className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-[#006699]">IEEE Registration</h1>
                        <p className="text-gray-600 mt-2">
                            Join the IEEE community or register for an upcoming event
                        </p>
                    </div>

                    {isSubmitted ? (
                        <motion.div 
                            className="text-center py-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
                                <p>Thank you for registering. We will contact you shortly with more information.</p>
                            </div>
                            <button 
                                onClick={() => setIsSubmitted(false)} 
                                className="bg-[#006699] text-white py-2 px-6 rounded-md hover:bg-[#00557A] transition-colors duration-300"
                            >
                                Register Again
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="firstName" className="block text-gray-700 mb-1">First Name<span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={`border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] transition-all duration-300`}
                                    />
                                    {errors.firstName && <span className="text-red-500 text-sm mt-1 block">{errors.firstName}</span>}
                                </div>

                                <div>
                                    <label htmlFor="lastName" className="block text-gray-700 mb-1">Last Name<span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className={`border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] transition-all duration-300`}
                                    />
                                    {errors.lastName && <span className="text-red-500 text-sm mt-1 block">{errors.lastName}</span>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-gray-700 mb-1">Email Address<span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] transition-all duration-300`}
                                />
                                {errors.email && <span className="text-red-500 text-sm mt-1 block">{errors.email}</span>}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`border ${errors.phone ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] transition-all duration-300`}
                                />
                                {errors.phone && <span className="text-red-500 text-sm mt-1 block">{errors.phone}</span>}
                            </div>

                            <div>
                                <label htmlFor="organization" className="block text-gray-700 mb-1">Organization/University</label>
                                <input
                                    type="text"
                                    id="organization"
                                    name="organization"
                                    value={formData.organization}
                                    onChange={handleChange}
                                    className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] transition-all duration-300"
                                />
                            </div>

                            <div>
                                <label htmlFor="membershipType" className="block text-gray-700 mb-1">Membership Type</label>
                                <select
                                    id="membershipType"
                                    name="membershipType"
                                    value={formData.membershipType}
                                    onChange={handleChange}
                                    className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] transition-all duration-300"
                                >
                                    <option value="regular">Regular Member</option>
                                    <option value="student">Student Member</option>
                                    <option value="associate">Associate Member</option>
                                    <option value="senior">Senior Member</option>
                                    <option value="fellow">Fellow</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="event" className="block text-gray-700 mb-1">Register for Event</label>
                                <select
                                    id="event"
                                    name="event"
                                    value={formData.event}
                                    onChange={handleChange}
                                    className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] transition-all duration-300"
                                >
                                    <option value="">Select an event (optional)</option>
                                    {events.map(event => (
                                        <option key={event.id} value={event.id}>
                                            {event.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <span className="block text-gray-700 mb-2">Areas of Interest</span>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {['Artificial Intelligence', 'Robotics', 'Power & Energy', 'Telecommunications', 
                                      'Computer Science', 'Biomedical Engineering', 'Cybersecurity', 'Sustainable Technology'].map(interest => (
                                        <div key={interest} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={interest.replace(/\s+/g, '')}
                                                name="interests"
                                                value={interest}
                                                checked={formData.interests.includes(interest)}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            <label htmlFor={interest.replace(/\s+/g, '')} className="text-gray-700">{interest}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="agreeToTerms"
                                        name="agreeToTerms"
                                        type="checkbox"
                                        checked={formData.agreeToTerms}
                                        onChange={handleChange}
                                        className="focus:ring-[#006699] h-4 w-4 text-[#006699] border-gray-300 rounded"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="agreeToTerms" className="text-gray-700">
                                        I agree to the <a href="#" className="text-[#006699] hover:underline">terms and conditions</a> and <a href="#" className="text-[#006699] hover:underline">privacy policy</a>
                                    </label>
                                    {errors.agreeToTerms && <div className="text-red-500 mt-1">{errors.agreeToTerms}</div>}
                                </div>
                            </div>

                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="bg-[#006699] text-white py-3 px-8 rounded-md font-semibold hover:bg-[#00557A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006699] transition-all duration-300 w-full md:w-auto"
                                >
                                    Complete Registration
                                </button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Register; 