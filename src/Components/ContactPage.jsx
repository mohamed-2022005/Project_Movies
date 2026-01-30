import React, { useState } from 'react'
import { contactStyles } from '../assets/dummyStyles'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Ticket, MessageCircle, Send, Phone, Popcorn, Mail, MapPin } from 'lucide-react';

const ContactPage = () => {
    // State to manage contact form input values
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    // Handle input field changes with special validation for phone number
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const digits = value.replace(/\D/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, phone: digits }));
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Form submission handler to redirect data to WhatsApp
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.phone || formData.phone.length !== 10) {
            toast.error("⚠️ Please enter a valid 10-digit phone number.");
            return;
        }
        const whatsappMessage = `Name: ${encodeURIComponent(formData.name)}%0AEmail: ${encodeURIComponent(formData.email)}%0APhone: ${encodeURIComponent(formData.phone)}%0ASubject: ${encodeURIComponent(formData.subject)}%0AMessage: ${encodeURIComponent(formData.message)}`;
        window.open(`https://wa.me/8299431275?text=${whatsappMessage}`, "_blank");
    };

    return (
        <div className={contactStyles.pageContainer}>
            {/* Notification system container */}
            <ToastContainer position="top-right" autoClose={2000} theme="dark" />

            {/* Background decorative elements */}
            <div className={contactStyles.bgGradient}></div>
            <div className={contactStyles.bgBlob1}></div>
            <div className={contactStyles.bgBlob2}></div>

            {/* Top film strip animation element */}
            <div className={contactStyles.filmStripTop}>
                {[...Array(20)].map((_, i) => (
                    <div key={i} className={contactStyles.filmStripSegment}></div>
                ))}
            </div>

            {/* Bottom film strip animation element */}
            <div className={contactStyles.filmStripBottom}>
                {[...Array(20)].map((_, i) => (
                    <div key={i} className={contactStyles.filmStripSegment}></div>
                ))}
            </div>

            <div className={contactStyles.contentContainer}>
                {/* Page title and description */}
                <div className={contactStyles.headerContainer}>
                    <h1 className={contactStyles.headerTitle}>
                        <span className={contactStyles.headerTitleRed}>Contact</span>
                        <span className={contactStyles.headerTitleWhite}> Us</span>
                    </h1>
                    <p className={contactStyles.headerSubtitle}>
                        Have questions about movie bookings or special events? Our team is here to help you.
                    </p>
                </div>

                <div className={contactStyles.gridContainer}>
                    {/* Left Column: Interactive Contact Form */}
                    <div className={contactStyles.cardRelative}>
                        <div className={contactStyles.cardGradient} />
                        <div className={contactStyles.cardContainer}>
                            <div className={contactStyles.cardBadge}>
                                <Ticket className={contactStyles.cardIcon} />
                                BOOKING SUPPORT
                            </div>
                            <div className={contactStyles.formContainer}>
                                <h2 className={contactStyles.formTitle}>
                                    <MessageCircle className={contactStyles.formTitleIcon} />
                                    Send us a Message
                                </h2>
                                <form onSubmit={handleSubmit} className={contactStyles.form}>
                                    <div className={contactStyles.formGrid}>
                                        <div>
                                            <label className={contactStyles.inputGroup}>Full Name *</label>
                                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className={contactStyles.input} placeholder="Your Name" />
                                        </div>
                                        <div>
                                            <label className={contactStyles.inputGroup}>Email Address *</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className={contactStyles.input} placeholder="your@example.com" />
                                        </div>
                                        <div>
                                            <label className={contactStyles.inputGroup}>Phone Number *</label>
                                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className={contactStyles.input} placeholder="Your Phone Number" />
                                        </div>
                                        <div>
                                            <label className={contactStyles.inputGroup}>Subject *</label>
                                            <select name="subject" value={formData.subject} onChange={handleChange} required className={contactStyles.select}>
                                                <option value="">Select a subject</option>
                                                <option value="Ticket Booking">Ticket Booking</option>
                                                <option value="Group Events">Group Events</option>
                                                <option value="Membership">Membership Inquiry</option>
                                                <option value="Technical Issue">Technical Issue</option>
                                                <option value="Refund">Refund Request</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className={contactStyles.inputGroup}>Message *</label>
                                        <textarea name="message" value={formData.message} onChange={handleChange} required rows="4" className={contactStyles.textarea} placeholder="Please describe your inquiry in details..."></textarea>
                                    </div>
                                    <button type="submit" className={contactStyles.submitButton}>
                                        <span>Send via WhatsApp</span>
                                        <Send className={contactStyles.buttonIcon} size={18} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Details and Emergency Support */}
                    <div className="space-y-6">
                        {/* Standard Contact Info Card */}
                        <div className={contactStyles.cardRelative}>
                            <div className={contactStyles.cardGradient}></div>
                            <div className={contactStyles.cardContainer}>
                                <div className={contactStyles.cardBadge}>
                                    <Popcorn className={contactStyles.cardIcon} />
                                    CINEMA INFO
                                </div>
                                <h2 className={contactStyles.formTitle}>Contact Information</h2>
                                <div className={contactStyles.contactInfo}>
                                    <div className={contactStyles.contactItem}>
                                        <div className={contactStyles.contactIconContainer}><Phone className={contactStyles.contactIcon} /></div>
                                        <div>
                                            <h3 className={contactStyles.contactText}>Booking Hotline</h3>
                                            <p className={contactStyles.contactDetail}>+91 8299431275</p>
                                        </div>
                                    </div>
                                    <div className={contactStyles.contactItem}>
                                        <div className={contactStyles.contactIconContainer}><Mail className={contactStyles.contactIcon} /></div>
                                        <div>
                                            <h3 className={contactStyles.contactText}>Email Address</h3>
                                            <p className={contactStyles.contactDetail}>booking@cineplex.com</p>
                                            <p className={contactStyles.contactDetail}>support@cineplex.com</p>
                                        </div>
                                    </div>
                                    <div className={contactStyles.contactItem}>
                                        <div className={contactStyles.contactIconContainer}><MapPin className={contactStyles.contactIcon} /></div>
                                        <div>
                                            <h3 className={contactStyles.contactText}>Main Theater Location</h3>
                                            <p className={contactStyles.contactDetail}>123 Cinema Street, Film City, Mumbai</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Support Card for urgent cinema issues */}
                        <div className={contactStyles.cardRelative}>
                            <div className={contactStyles.emergencyCardGradient}></div>
                            <div className={contactStyles.emergencyCard}>
                                <h3 className={contactStyles.emergencyTitle}>
                                    <Phone className={contactStyles.emergencyIcon} />
                                    Urgent Show-Related Issues
                                </h3>
                                <p className={contactStyles.emergencyText}>
                                    For urgent issues during a movie screening (sound, projection, etc.)
                                </p>
                                <div className="flex items-center">
                                    <div className={contactStyles.emergencyHotline}>
                                        HOTLINE: +91 8299431275
                                    </div>
                                    <span className={contactStyles.emergencyNote}>Available during showtimes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactPage