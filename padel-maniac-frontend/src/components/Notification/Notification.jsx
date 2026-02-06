import React, { useState, useEffect, useRef } from 'react';
import './Notification.css';
import NotificatioService from "../../services/NotificatioService";
import { useStomp } from "../../services/useStomp";

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const userId = localStorage.getItem('userId');
    const { messages,sendMessage} = useStomp(`/topic/notifications/${userId}`);

    // Fetch initial notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await NotificatioService.getNotifications(userId);
                setNotifications(response.data.data || []);
            } catch (e) {
                console.error("Failed to load notifications:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [userId]);

    useEffect(() => {
        if (!messages) return;
        console.log("set message", messages)
        const newNotification = messages

        setNotifications(prev => [newNotification, ...prev]);
    }, [messages]);

    // Close dropdown if click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
        sendMessage("/app/reed-notification",id);
    };

    const markAllAsRead = () => {
        sendMessage("/app/reed-all-notification",userId);
        setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    };

    const clearAll = () => {
        sendMessage("/app/remove-all-notification",userId);
        setNotifications([])
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const toggleDropdown = () => {
        if (!loading) {
            setIsOpen(prev => !prev);
        }
    };

    return (
        <div className="notification-bell" ref={dropdownRef}>
            <button
                className="bell-button"
                onClick={toggleDropdown}
                disabled={loading}
            >
                🔔
                {!loading && unreadCount > 0 && (
                    <span className="notification-count">{unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="dropdown-header">
                        <h3>Notifications</h3>
                        <div className="header-actions">
                            {unreadCount > 0 && (
                                <button className="action-btn" onClick={markAllAsRead}>
                                    Mark all read
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button className="action-btn" onClick={clearAll}>
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="notification-list">
                        {loading ? (
                            <div className="empty-notifications">
                                <p>Loading notifications...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="empty-notifications">
                                <p>No notifications</p>
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="notification-message">
                                        {notification.message}
                                    </div>
                                    <div className="notification-time">
                                        {notification.sentAt}
                                    </div>
                                    {!notification.read && <div className="unread-dot"></div>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notification;
