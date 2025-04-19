import React from 'react';
import { Instagram, Facebook, Youtube } from 'lucide-react';
// Update the path below if the actual location is different
import { TextHoverEffect } from '../ui/text-hover-effect';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-1 w-full"></div>
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Logo */}
                    <div className="flex items-center justify-center md:justify-start">
                        <Image src={"/espektro-logo-white.png"} alt="Espektro Logo" width={150} height={150} />
                    </div>

                    {/* Contact Information */}
                    <div className="text-center md:text-left space-y-6">
                        <div>
                            <h3 className="text-xl mb-2 text-purple-400">Let this person be X</h3>
                            <p className="text-gray-300">Chairperson</p>
                            <p className="text-gray-300">+91 1234567890</p>
                        </div>
                        <div>
                            <h3 className="text-xl mb-2 text-purple-400">Let this person be Y</h3>
                            <p className="text-gray-300">Vice-Chairperson</p>
                            <p className="text-gray-300">+91 1234567890 </p>
                        </div>
                    </div>

                    {/* Address and Branding */}
                    <div className="text-center md:text-right space-y-8">
                        <div>
                            <h3 className="text-xl mb-2 text-purple-400">Address</h3>
                            <p className="text-gray-300">Fest Ground, <br/>Kalyani Government Engineering College,</p>
                            <p className="text-gray-300">Kalyani, Nadia, West Bengal, India, Pin- 741235</p>
                        </div>

                        <div className="text-right">
                            <p className="text-xl text-purple-400">KGEC&apos;s</p>
                            <p className="text-5xl font-light bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"><TextHoverEffect text='Espektro'></TextHoverEffect></p>
                        </div>
                    </div>
                </div>

                {/* Social Media and Copyright */}
                <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between">
                    <p className="text-gray-400 text-sm">© Espektro KGEC</p>

                    <div className="my-6 md:my-0">
                        <h3 className="text-center mb-4 text-purple-400">Follow us on</h3>
                        <div className="flex justify-center space-x-6">
                            <a href="https://www.instagram.com/espektro_kgec" className="text-gray-300 hover:text-purple-400 transition-colors">
                                <Instagram size={24} />
                            </a>
                            <a href="https://www.facebook.com/espektrokgec" className="text-gray-300 hover:text-purple-400 transition-colors">
                                <Facebook size={24} />
                            </a>
                            <a href="https://www.youtube.com/@EspektroKGEC" className="text-gray-300 hover:text-purple-400 transition-colors">
                                <Youtube size={24} />
                            </a>
                        </div>
                    </div>

                    <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">
                        Event Brochure
                    </a>
                </div>
            </div>
        </footer>
    );
}