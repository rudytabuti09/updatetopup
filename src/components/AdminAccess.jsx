import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Icon from './AppIcon';

const AdminAccess = ({ className = '' }) => {
  const { profile } = useAuth();

  // Only show for admin and moderator users
  if (!profile || (profile.role !== 'admin' && profile.role !== 'moderator')) {
    return null;
  }

  return (
    <Link
      to="/admin"
      className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-lg font-gaming font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${className}`}
    >
      <Icon name="Shield" size={16} />
      <span>Admin Panel</span>
      <Icon name="ExternalLink" size={14} />
    </Link>
  );
};

export default AdminAccess;