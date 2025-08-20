import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import Icon from './AppIcon';
import Button from './ui/Button';

const CreateAdminProfile = () => {
  const { user, fetchProfile } = useAuth();
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState('');

  const createAdminProfile = async () => {
    if (!user) {
      setResult('❌ No user logged in');
      return;
    }

    setCreating(true);
    setResult('🔄 Creating admin profile...');

    try {
      // First, try to create the profile
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: `admin_${user.email.split('@')[0]}`,
          full_name: `Admin ${user.email.split('@')[0]}`,
          role: 'admin',
          is_verified: true,
          total_spent: 0,
          total_transactions: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        // If profile exists, update it
        if (insertError.code === '23505') { // Unique constraint violation
          setResult('🔄 Profile exists, updating to admin...');
          
          const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({
              role: 'admin',
              is_verified: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id)
            .select()
            .single();

          if (updateError) {
            throw updateError;
          }

          setResult('✅ Profile updated to admin successfully!');
        } else {
          throw insertError;
        }
      } else {
        setResult('✅ Admin profile created successfully!');
      }

      // Refresh the profile in AuthContext
      await fetchProfile(user.id);
      
      // Add success message
      setTimeout(() => {
        setResult(prev => prev + '\n🔄 Refreshing profile data...');
      }, 1000);

      setTimeout(() => {
        setResult(prev => prev + '\n✅ Profile refreshed! You can now access admin panel.');
      }, 2000);

    } catch (error) {
      console.error('Error creating admin profile:', error);
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setCreating(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
        <div className="text-red-500 font-medium">
          ❌ Please login first to create admin profile
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
      <h3 className="text-lg font-gaming font-bold text-foreground mb-4">
        🚀 Create Admin Profile
      </h3>
      
      <div className="space-y-4">
        <div className="bg-surface/10 rounded-lg p-4">
          <div className="text-sm space-y-1">
            <div><strong>User ID:</strong> <code className="text-xs">{user.id}</code></div>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Action:</strong> Create/Update profile with admin role</div>
          </div>
        </div>

        <Button 
          onClick={createAdminProfile} 
          loading={creating}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
        >
          <Icon name="Crown" size={16} className="mr-2" />
          {creating ? 'Creating Admin Profile...' : 'Create Admin Profile Now'}
        </Button>

        {result && (
          <div className="bg-surface/20 rounded-lg p-4">
            <pre className="text-sm whitespace-pre-wrap font-mono">
              {result}
            </pre>
          </div>
        )}

        <div className="text-xs text-text-secondary">
          <strong>Note:</strong> This will create a profile in the database with admin role. 
          After creation, refresh the page to see the changes.
        </div>
      </div>
    </div>
  );
};

export default CreateAdminProfile;