import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ActivationCode } from '../types';
import { ADMIN_EMAIL } from '../types';

export function useActivationCodes() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [codes, setCodes] = useState<ActivationCode[]>([]);
  const [newCode, setNewCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userEmail = localStorage.getItem('user_email');

    if (!token) {
      navigate('/');
      return;
    }
    if (userEmail === ADMIN_EMAIL) {
      setIsAdmin(true);
      loadCodes();
    } else {
      navigate('/dashboard');
    }
    setIsChecking(false);
  }, [navigate]);

  const loadCodes = () => {
    const storedCodes = localStorage.getItem('activation_codes');
    if (storedCodes) setCodes(JSON.parse(storedCodes));
  };

  const generateCode = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const code = 'ovelix-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const newActivationCode: ActivationCode = {
        id: Date.now().toString(),
        code,
        createdAt: new Date().toISOString(),
        used: false,
      };
      const updatedCodes = [newActivationCode, ...codes];
      localStorage.setItem('activation_codes', JSON.stringify(updatedCodes));
      setCodes(updatedCodes);
      setNewCode(code);
      setIsGenerating(false);
    }, 500);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const deleteCode = (id: string) => {
    const updatedCodes = codes.filter(c => c.id !== id);
    localStorage.setItem('activation_codes', JSON.stringify(updatedCodes));
    setCodes(updatedCodes);
    setShowDeleteConfirm(null);
  };

  const markAsUsed = (id: string) => {
    const updatedCodes = codes.map(c =>
      c.id === id ? { ...c, used: true, usedAt: new Date().toISOString() } : c
    );
    localStorage.setItem('activation_codes', JSON.stringify(updatedCodes));
    setCodes(updatedCodes);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_email');
    navigate('/');
  };

  return {
    isAdmin, isChecking, codes, newCode, isGenerating, copiedCode, showDeleteConfirm,
    generateCode, copyCode, deleteCode, markAsUsed, handleLogout,
    setShowDeleteConfirm,
  };
}
