import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Tortisal from '../../assets/logo/tortisal.png'
import { AuthContext } from '../../auth/context/AuthContext';
import { useContext } from 'react';

export const Navbar = () => {
    const { onLogout } = useContext(AuthContext)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate()
    const handleLogout = () => {
        onLogout();
        navigate('/login', {
            replace: true
        })
    }


    return (
        <header className="absolute inset-x-0 top-0 z-50">
            <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link to={'/'} className="-m-1.5 p-1.5">
                        <span className="sr-only">Tortisal</span>
                        <img className="h-8 w-auto" src={Tortisal} alt="" />
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    <NavLink to="/" className={(({ isActive }) => `nav-item nav-link text-sm/6 font-semibold text-gray-900 ${isActive ? 'active' : ''}`)}>Inventario</NavLink>
                    <NavLink to='/employees'className={(({ isActive }) => `nav-item nav-link text-sm/6 font-semibold text-gray-900 ${isActive ? 'active' : ''}`)}>Empleados</NavLink>
                    <NavLink to="/users" className={(({ isActive }) => `nav-item nav-link text-sm/6 font-semibold text-gray-900 ${isActive ? 'active' : ''}`)}>Usuarios</NavLink>
                    <NavLink to="/tools-issued" className={(({ isActive }) => `nav-item nav-link text-sm/6 font-semibold text-gray-900 ${isActive ? 'active' : ''}`)}>Herramientas emitidas</NavLink>
                    <NavLink to="/shifts" className={(({ isActive }) => `nav-item nav-link text-sm/6 font-semibold text-gray-900 ${isActive ? 'active' : ''}`)}>Turnos</NavLink>
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <button onClick={handleLogout} className="text-sm/6 font-semibold text-gray-900">Cerrar sesión <span aria-hidden="true">&rarr;</span></button>
                </div>
            </nav>
            {/*show mobile*/}
            {isMobileMenuOpen && (
                <div className="lg:hidden" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 z-50"></div>
                    <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 flex flex-col">
                        <div className="flex items-center justify-end mb-6">
                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="rounded-md p-2.5 text-gray-700"
                            >
                                <span className="sr-only">Close menu</span>
                                <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    <NavLink to="/" className={(({ isActive }) => `-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 ${isActive ? 'active' : ''}`)}>Inventario</NavLink>
                                    <NavLink to='/employees'className={(({ isActive }) => `-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 ${isActive ? 'active' : ''}`)}>Empleados</NavLink>
                                    <NavLink to="/users" className={(({ isActive }) => `-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 ${isActive ? 'active' : ''}`)}>Usuarios</NavLink>
                                    <NavLink to="/tools-issued" className={(({ isActive }) => `-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 ${isActive ? 'active' : ''}`)}>Herramientas emitidas</NavLink>
                                    <NavLink to="/shifts" className={(({ isActive }) => `-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 ${isActive ? 'active' : ''}`)}>Turnos</NavLink>

                                </div>
                                <div className="py-6">
                                    <Link to="/login" className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">Cerrar Sessión</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>

    );
};




