import React, { useState, useEffect } from 'react';
import { ShoppingBag, MapPin, Star, Heart, ArrowRight, Instagram, Phone, Menu, X, ChevronRight, ChevronLeft, Store } from 'lucide-react';

const ChurnLanding = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('todos');
    const [displayedCategory, setDisplayedCategory] = useState('todos');
    const [currentPage, setCurrentPage] = useState(0);
    const [productsPerPage, setProductsPerPage] = useState(4);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Reset page on category change with smooth transition
    useEffect(() => {
        if (activeCategory !== displayedCategory) {
            setIsTransitioning(true);
            setCurrentPage(0);
            // Wait for fade-out to complete before changing content
            const timer = setTimeout(() => {
                setDisplayedCategory(activeCategory);
                // Small delay before fade-in
                setTimeout(() => {
                    setIsTransitioning(false);
                }, 50);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [activeCategory, displayedCategory]);

    // Responsive products per page
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setProductsPerPage(1); // Mobile: 1 product
            } else if (window.innerWidth < 1024) {
                setProductsPerPage(2); // Tablet: 2 products
            } else {
                setProductsPerPage(4); // Desktop: 4 products
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Scroll reveal animation hook
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                }
            });
        }, observerOptions);

        // Observe all elements with reveal classes
        const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-slide-up, .reveal-slide-left, .reveal-slide-right');
        revealElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    // Manejo del scroll para el navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMenuOpen(false);
        }
    };

    // Touch/Swipe handling for mobile
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        const maxPages = Math.ceil(filteredProducts.length / productsPerPage) - 1;

        if (isLeftSwipe && currentPage < maxPages) {
            setCurrentPage(prev => prev + 1);
        }

        if (isRightSwipe && currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const products = [
        { id: 1, name: "Clásico", price: "$800", category: "churros", image: "/imagenes/productosSinFondo/churroClasico.png", bg: "bg-[#fffce0]", btnColor: "bg-[#79a834]" },
        { id: 2, name: "Dulce de Leche", price: "$1200", category: "churros", image: "/imagenes/productosSinFondo/churroDDLGemini.png", bg: "bg-[#fffce0]", btnColor: "bg-[#ff9e80]" },
        { id: 3, name: "Crema Pastelera", price: "$1200", category: "churros", image: "/imagenes/productosSinFondo/cremapastelera.png", bg: "bg-[#fffce0]", btnColor: "bg-[#f48fb1]" },
        { id: 4, name: "Chocolate", price: "$1500", category: "churros", image: "/imagenes/productosSinFondo/ChurroChocolateGemini.png", bg: "bg-[#fffce0]", btnColor: "bg-[#4dd0e1]" },
        { id: 5, name: "Choco Blanco", price: "$1500", category: "churros", image: "/imagenes/productosSinFondo/churroBlancoGemini.png", bg: "bg-[#fffce0]", btnColor: "bg-[#d7ccc8]" },
        { id: 6, name: "Chipá", price: "$1500", category: "otros", image: "/imagenes/productosSinFondo/chipaGemini.png", bg: "bg-[#fffce0]", btnColor: "bg-[#ffd54f]" },
        { id: 7, name: "Berlinesa", price: "$1800", category: "otros", image: "/imagenes/productosSinFondo/berlinesaGemini.png", bg: "bg-[#fffce0]", btnColor: "bg-[#79a834]" },
        { id: 8, name: "Dona Oreo", price: "$2000", category: "donas", image: "/imagenes/productosSinFondo/donaOreo.png", bg: "bg-[#fffce0]", btnColor: "bg-[#ff9e80]" },
        { id: 9, name: "Dona Pink", price: "$2000", category: "donas", image: "/imagenes/productosSinFondo/donaPink.png", bg: "bg-[#fffce0]", btnColor: "bg-[#f48fb1]" },
        { id: 10, name: "Dona Chocotorta", price: "$2200", category: "donas", image: "/imagenes/productosSinFondo/donaChocotorta.png", bg: "bg-[#fffce0]", btnColor: "bg-[#4dd0e1]" },
    ];

    const filteredProducts = displayedCategory === 'todos'
        ? products
        : products.filter(p => p.category === displayedCategory);

    return (
        // CAMBIO: Fondo actualizado a #fcf283
        <div className="min-h-screen bg-[#fcf283] font-sans text-[#4A3B32] selection:bg-[#fc6471] selection:text-white">
            {/* Styles for fonts not available in Tailwind default */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&display=swap');
        
        @font-face {
          font-family: 'Genty Demo';
          src: url('/fonts/GentyDemo-Regular.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        
        .font-branding { font-family: 'Genty Demo', serif; }
        .font-serif-display { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'Poppins', sans-serif; }
        
        .blob-shape {
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
          animation: morph 8s ease-in-out infinite;
        }
        
        @keyframes morph {
          0%, 100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
          34% { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; }
          67% { border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; }
        }
        
        /* Scroll Reveal Animations */
        .reveal-fade-in {
          opacity: 0;
          transition: opacity 0.8s ease-out;
        }
        
        .reveal-slide-up {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        
        .reveal-slide-left {
          opacity: 0;
          transform: translateX(-40px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        
        .reveal-slide-right {
          opacity: 0;
          transform: translateX(40px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        
        .reveal-visible {
          opacity: 1 !important;
          transform: translateY(0) translateX(0) !important;
        }
        
        /* Custom Cursor */
        * {
          cursor: url('/imagenes/churro-cursor.png'), auto !important;
        }
        
        button, a, [role="button"] {
          cursor: url('/imagenes/churro-cursor.png'), pointer !important;
        }
      `}</style>

            {/* --- NAVBAR --- */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#fcf283]/90 backdrop-blur-md shadow-sm py-3 rounded-b-3xl' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
                        <img
                            src="/imagenes/LOGO CHURN.png"
                            alt="Churn Logo"
                            className="h-10 w-auto object-contain"
                        />
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8 font-body font-medium">
                        <button onClick={() => scrollToSection('nosotros')} className="hover:text-[#fc6471] transition-colors">Nosotros</button>
                        <button onClick={() => scrollToSection('productos')} className="hover:text-[#fc6471] transition-colors">Productos</button>
                        <button onClick={() => scrollToSection('mayorista')} className="hover:text-[#fc6471] transition-colors">Venta Mayorista</button>
                        <button onClick={() => scrollToSection('donde')} className="hover:text-[#fc6471] transition-colors">Ubicación</button>
                        <a href="https://api.whatsapp.com/send/?phone=541128673102&text=Hola%21+Quiero+hacerte+un+pedido&utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnePtbaeWW-y68pnczlro77dIP841_26hj8b69NhVJZUJ3n904y2ESA9frLs4_aem_vHnWeh59uooNcdc-kd73eA&brid=AWUwGOzYtz3qLsl12NQ_Wg" target="_blank" rel="noopener noreferrer" className="bg-[#fc6471] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#e0505c] transition-transform hover:scale-105 shadow-lg shadow-[#fc6471]/30 flex items-center gap-2">
                            <ShoppingBag size={18} />
                            Pedir Ahora
                        </a>
                    </div>

                    {/* Mobile Toggle */}
                    <button className="md:hidden text-[#4A3B32]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Menu */}
            </nav>

            {/* Mobile Menu Overlay & Sidebar - Moves outside nav to avoid layout/scroll issues */}
            <div className={`md:hidden fixed inset-0 z-[60] pointer-events-none`}>
                {/* Backdrop with Blur */}
                <div
                    className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-700 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}
                    onClick={() => setIsMenuOpen(false)}
                />

                {/* Sidebar */}
                <div className={`absolute top-0 left-0 h-full w-1/2 bg-[#fcf283] shadow-2xl flex flex-col gap-6 p-8 pt-32 font-body transform transition-transform duration-700 ease-in-out ${isMenuOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full'}`}>
                    {/* Close Button */}
                    <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8 text-[#4A3B32] hover:text-[#fc6471] transition-colors">
                        <X size={28} />
                    </button>

                    <button onClick={() => { scrollToSection('nosotros'); setIsMenuOpen(false) }} className="text-left text-lg py-2 border-b border-gray-100 text-[#4A3B32]">Nosotros</button>
                    <button onClick={() => { scrollToSection('productos'); setIsMenuOpen(false) }} className="text-left text-lg py-2 border-b border-gray-100 text-[#4A3B32]">Productos</button>
                    <button onClick={() => { scrollToSection('mayorista'); setIsMenuOpen(false) }} className="text-left text-lg py-2 border-b border-gray-100 text-[#4A3B32]">Mayorista</button>
                    <button onClick={() => { scrollToSection('donde'); setIsMenuOpen(false) }} className="text-left text-lg py-2 border-b border-gray-100 text-[#4A3B32]">Ubicación</button>
                    <a href="https://api.whatsapp.com/send/?phone=541128673102&text=Hola%21+Quiero+hacerte+un+pedido&utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnePtbaeWW-y68pnczlro77dIP841_26hj8b69NhVJZUJ3n904y2ESA9frLs4_aem_vHnWeh59uooNcdc-kd73eA&brid=AWUwGOzYtz3qLsl12NQ_Wg" target="_blank" rel="noopener noreferrer" className="bg-[#fc6471] text-white w-full py-3 rounded-xl font-bold mt-4 shadow-lg shadow-[#fc6471]/30 text-center block">Hacer Pedido</a>
                </div>
            </div>

            {/* --- HERO SECTION --- */}
            <section id="hero" className="relative pt-32 pb-20 md:pt-24 md:pb-32 px-6 overflow-hidden">
                {/* Background Decorative Blobs */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#fc6471] blob-shape opacity-10 -z-10 translate-x-1/3 -translate-y-1/4"></div>
                {/* Adjusted opacity/color for the yellow blob on yellow background to keep it visible but subtle */}
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white blob-shape opacity-20 -z-10 -translate-x-1/4 translate-y-1/4"></div>

                <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 md:pr-10 reveal-slide-left">
                        {/* Cambio: Fondo de la pastilla ajustado para contraste con amarillo */}

                        <h1 className="font-branding text-5xl md:text-7xl leading-[1.1] text-[#4A3B32]">
                            Churros de verdad, <span className="text-[#fc6471] italic">hechos con amor.</span>
                        </h1>
                        <p className="font-body text-lg text-[#4A3B32]/80 max-w-md leading-relaxed">
                            Crujientes por fuera, suaves por dentro. Elaborados al momento con ingredientes seleccionados para que cada bocado sea una experiencia.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button onClick={() => scrollToSection('productos')} className="bg-[#fc6471] text-white px-8 py-4 rounded-full font-bold font-body text-lg hover:bg-[#e0505c] transition-all shadow-xl shadow-[#fc6471]/20 flex items-center justify-center gap-2 group">
                                Ver Menú
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </button>
                            <button onClick={() => scrollToSection('donde')} className="bg-white/80 backdrop-blur-sm text-[#4A3B32] border-2 border-white/50 px-8 py-4 rounded-full font-bold font-body text-lg hover:bg-white hover:border-white transition-all flex items-center justify-center gap-2">
                                <MapPin size={20} />
                                Visítanos
                            </button>
                        </div>

                        {/* Social Proof */}
                        <div className="flex items-center gap-4 pt-6 reveal-fade-in">
                            <div className="flex -space-x-3">
                                <div className="w-10 h-10 rounded-full border-2 border-[#fcf283] bg-gray-200 overflow-hidden">
                                    <img src="/imagenes/aisha.png" alt="User" className="w-full h-full object-cover" />
                                </div>
                                <div className="w-10 h-10 rounded-full border-2 border-[#fcf283] bg-gray-200 overflow-hidden">
                                    <img src="/imagenes/camiVaca.png" alt="User" className="w-full h-full object-cover" />
                                </div>
                                <div className="w-10 h-10 rounded-full border-2 border-[#fcf283] bg-gray-200 overflow-hidden">
                                    <img src="/imagenes/sami.png" alt="User" className="w-full h-full object-cover" />
                                </div>
                                <div className="w-10 h-10 rounded-full border-2 border-[#fcf283] bg-gray-200 overflow-hidden">
                                    <img src="/imagenes/unnamed.png" alt="User" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="font-body text-sm">
                                <div className="flex text-[#4A3B32] gap-0.5">
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                </div>
                                <p className="text-[#4A3B32]/70 font-medium">+Clientes satisfechos</p>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image / Composition */}
                    <div className="relative reveal-slide-right">
                        <div className="aspect-square relative z-10">
                            <img
                                src="/imagenes/bolsaChurn.png"
                                alt="Churros deliciosos"
                                className="w-full h-full object-contain drop-shadow-2xl rotate-3 hover:rotate-0 transition-all duration-700"
                            />
                            {/* Floating Elements */}

                        </div>
                        {/* Decor */}
                        <div className="absolute top-10 -right-10 w-24 h-24 bg-white rounded-full blur-3xl opacity-40"></div>
                    </div>
                </div>
            </section>

            {/* --- SOBRE NOSOTROS --- */}
            <section id="nosotros" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-12 gap-12 items-center">
                        {/* Image Grid */}
                        <div className="md:col-span-5 grid grid-cols-2 gap-4 reveal-slide-left">
                            <img
                                src="/imagenes/fotoAbout.jpeg"
                                className="rounded-2xl w-full h-64 object-cover translate-y-8"
                                alt="Haciendo churros"
                            />
                            <img
                                src="/imagenes/galeria/churros2.jpeg"
                                className="rounded-2xl w-full h-64 object-cover"
                                alt="Cafetería ambiente"
                            />
                        </div>

                        {/* Content */}
                        <div className="md:col-span-7 md:pl-10 reveal-slide-right">
                            <h2 className="font-branding text-4xl md:text-5xl text-[#4A3B32] mb-6">
                                No seguimos modas, <br />
                                <span className="text-[#fc6471]">perfeccionamos la receta.</span>
                            </h2>
                            <p className="font-body text-[#8D7B6F] text-lg leading-relaxed mb-4">
                                En Churn creemos que la excelencia está en los detalles. No seguimos modas ni fórmulas rápidas: perfeccionamos el arte de hacer churros para ofrecer una experiencia que combina tradición y calidad.
                            </p>
                            <p className="font-body text-[#8D7B6F] text-lg leading-relaxed mb-6">
                                Cada pieza se elabora en el momento, con ingredientes seleccionados y una técnica que asegura la textura y el sabor perfectos. Porque no buscamos que nos elijas por costumbre, sino por verdadero gusto.
                            </p>

                            <div className="flex items-center gap-4 mt-8 border-t border-gray-100 pt-8">
                                <div className="flex -space-x-4">
                                    <img src="/imagenes/Sebastian.png" className="w-14 h-14 rounded-full border-4 border-white" alt="Sebastian" />
                                    <img src="/imagenes/Evelyn.png" className="w-14 h-14 rounded-full border-4 border-white" alt="Evelyn" />
                                </div>
                                <div>
                                    <p className="font-poppins font-bold text-lg text-[#4A3B32]">Sebastian & Evelyn</p>
                                    <p className="font-poppins text-sm text-[#fc6471] font-bold">Fundadores</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PRODUCTOS --- */}
            {/* CAMBIO: Fondo actualizado a #fcf283 */}
            <section id="productos" className="py-24 bg-[#fcf283]">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16 reveal-slide-up">
                        <span className="text-[#fc6471] font-bold font-body tracking-wider uppercase text-sm">Nuestro Menú</span>
                        <h2 className="font-branding text-4xl md:text-5xl mt-2 mb-6 text-[#4A3B32]">Delicias Crujientes</h2>

                        {/* Filter Pills */}
                        <div className="flex flex-wrap justify-center gap-3 mt-8">
                            {['todos', 'churros', 'donas', 'otros'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-2 rounded-full font-body font-bold text-sm capitalize transition-all ${activeCategory === cat
                                        ? 'bg-[#4A3B32] text-white shadow-lg'
                                        : 'bg-white/80 backdrop-blur-sm text-[#4A3B32] hover:bg-white'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-hidden max-w-6xl mx-auto pt-48 pb-12">
                        <div
                            className={`flex transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
                            style={{ transform: `translateX(-${currentPage * 100}%)` }}
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                        >
                            {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }).map((_, pageIndex) => (
                                <div key={pageIndex} className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-56 px-4">
                                    {filteredProducts.slice(pageIndex * productsPerPage, (pageIndex + 1) * productsPerPage).map((product) => (
                                        <div key={product.id} className={`group ${product.bg} rounded-[2.5rem] p-6 pt-0 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl w-full max-w-[170px] mx-auto`}>
                                            {/* Image Area - Floating effect */}
                                            <div className="relative w-80 h-80 -mt-40 mb-4 filter drop-shadow-2xl transition-transform duration-500 z-10">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>

                                            {/* Content Area */}
                                            <div className="flex flex-col items-center w-full pb-2">
                                                <h3 className="font-body font-bold text-xl text-[#3f3f3f] leading-tight">{product.name}</h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Carousel Navigation Controls */}
                    {filteredProducts.length > productsPerPage && (
                        <div className="flex justify-center items-center gap-6 mt-6">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                disabled={currentPage === 0}
                                className={`p-3 rounded-full border-2 border-[#4A3B32] text-[#4A3B32] transition-all ${currentPage === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#4A3B32] hover:text-white'}`}
                            >
                                <ChevronLeft size={24} />
                            </button>

                            {/* Pagination Dots */}
                            <div className="flex gap-2">
                                {[...Array(Math.ceil(filteredProducts.length / productsPerPage))].map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentPage(idx)}
                                        className={`w-3 h-3 rounded-full transition-all ${currentPage === idx ? 'bg-[#4A3B32] scale-125' : 'bg-[#4A3B32]/30 hover:bg-[#4A3B32]/50'}`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredProducts.length / productsPerPage) - 1, prev + 1))}
                                disabled={currentPage >= Math.ceil(filteredProducts.length / productsPerPage) - 1}
                                className={`p-3 rounded-full border-2 border-[#4A3B32] text-[#4A3B32] transition-all ${currentPage >= Math.ceil(filteredProducts.length / productsPerPage) - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#4A3B32] hover:text-white'}`}
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* --- MAYORISTA (B2B) --- */}
            < section id="mayorista" className="py-20 px-6" >
                <div className="container mx-auto bg-[#4A3B32] rounded-[3rem] text-white overflow-hidden relative reveal-slide-up">
                    <div className="grid md:grid-cols-2">
                        <div className="p-12 md:p-16 flex flex-col justify-center relative z-10">
                            <div className="inline-block bg-[#fc6471] text-white text-xs font-bold px-3 py-1 rounded-md w-fit mb-6">B2B</div>
                            <h2 className="font-branding text-3xl md:text-5xl mb-6">¿Tienes un negocio?</h2>
                            <p className="font-body text-white/80 text-lg mb-8">
                                Llevá la calidad de Churn a tus clientes. Ofrecemos precios especiales para mayoristas, entregas programadas y productos personalizados para tu marca.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="bg-[#fc6471] text-white px-8 py-3.5 rounded-xl font-bold font-body hover:bg-[#e0505c] transition-colors">
                                    Contactar Ventas
                                </button>
                                <button className="bg-transparent border border-white/30 text-white px-8 py-3.5 rounded-xl font-bold font-body hover:bg-white/10 transition-colors">
                                    Descargar Catálogo
                                </button>
                            </div>
                        </div>
                        <div className="relative h-64 md:h-auto bg-gray-800">
                            <img
                                src="/imagenes/galeria/fotoMayorista.jpeg"
                                className="absolute inset-0 w-full h-full object-cover opacity-80"
                                alt="Negocio de café"
                            />
                            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#4A3B32]"></div>
                        </div>
                    </div>
                </div>
            </section >

            {/* --- UBICACION Y FOOTER --- */}
            < section id="donde" className="bg-white pt-20" >
                <div className="container mx-auto px-6 mb-20">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="reveal-slide-left">
                            <h2 className="font-branding text-4xl text-[#4A3B32] mb-8">¿Donde estamos?</h2>

                            <div className="space-y-8 font-body">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-[#fc6471]/10 rounded-full flex items-center justify-center text-[#fc6471] shrink-0">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[#8D7B6F]">Cno. de la Virgen María 89,<br />Villa Madero, Buenos Aires</p>
                                        <a href="https://maps.app.goo.gl/14nDwuEF3Z6ef6L48" target="_blank" rel="noopener noreferrer" className="text-[#fc6471] font-bold text-sm mt-2 inline-block hover:underline">Ver en Google Maps</a>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-[#fc6471]/10 rounded-full flex items-center justify-center text-[#fc6471] shrink-0">
                                        <Store size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-[#4A3B32]">Horarios</h3>
                                        <p className="text-[#8D7B6F]">Viernes: 15:30 a 19:00</p>
                                        <p className="text-[#8D7B6F]">Sábado: 09:00 a 12:00 y 15:30 a 19:00</p>
                                        <p className="text-[#8D7B6F]">Domingo: 09:00 a 12:00 y 15:30 a 19:00</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-[#fc6471]/10 rounded-full flex items-center justify-center text-[#fc6471] shrink-0">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-[#4A3B32]">Contacto</h3>
                                        <p className="text-[#8D7B6F]">+54 9 11 2867-3102</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Simulated Map Visual */}
                        <div className="bg-gray-100 rounded-3xl overflow-hidden min-h-[400px] relative group reveal-slide-right">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1640.2874481124593!2d-58.489652!3d-34.690677!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccecba08866cd%3A0xb40d37c44360b63a!2sChurn!5e0!3m2!1ses!2sus!4v1766519734012!5m2!1ses!2sus"
                                className="w-full h-full absolute inset-0 border-0"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade">
                            </iframe>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-[#4A3B32] text-[#E5DACE] pt-20 pb-10 rounded-t-[3rem] relative overflow-hidden">
                    {/* Wavy top visual handled by border-radius for cleaner look */}

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
                            <div className="text-center md:text-left">
                                <img
                                    src="/imagenes/LOGO CHURN.png"
                                    alt="Churn Logo"
                                    className="h-12 mx-auto md:mx-0 mb-6 object-contain"
                                />
                                <p className="font-body max-w-sm opacity-80">Disfruta el dulce sabor de la tradición. Hechos a mano, todos los días.</p>
                            </div>
                            <div className="flex gap-4">
                                <a href="https://www.instagram.com/churreria.churn/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-[#E5DACE]/30 flex items-center justify-center hover:bg-[#fc6471] hover:border-[#fc6471] hover:text-white transition-all">
                                    <Instagram size={20} />
                                </a>
                                <a href="https://api.whatsapp.com/send/?phone=541128673102&text=Hola%21+Quiero+hacerte+un+pedido&utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnePtbaeWW-y68pnczlro77dIP841_26hj8b69NhVJZUJ3n904y2ESA9frLs4_aem_vHnWeh59uooNcdc-kd73eA&brid=AWUwGOzYtz3qLsl12NQ_Wg" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-[#E5DACE]/30 flex items-center justify-center hover:bg-[#fc6471] hover:border-[#fc6471] hover:text-white transition-all">
                                    <Phone size={20} />
                                </a>
                            </div>
                        </div>

                        <div className="border-t border-[#E5DACE]/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm font-body opacity-60">
                            <p>&copy; 2024 Churn Churros. Todos los derechos reservados.</p>
                            <div className="flex gap-6 mt-4 md:mt-0">
                                <a href="#" className="hover:text-white">Privacidad</a>
                                <a href="#" className="hover:text-white">Términos</a>
                                <p>Diseñado y Desarrollado por <a href="https://gonzaorellana.com.ar/portfolio/" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-[#fc6471] transition-colors">Gonzalo Orellana</a></p>
                            </div>
                        </div>
                    </div>
                </footer>
            </section >


        </div >
    );
};

export default ChurnLanding;
