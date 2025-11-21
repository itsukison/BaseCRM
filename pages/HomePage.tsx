import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingPage } from '../components/LandingPage';

export const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const handleEnter = () => {
        navigate('/dashboard');
    };

    return <LandingPage onEnter={handleEnter} />;
};
