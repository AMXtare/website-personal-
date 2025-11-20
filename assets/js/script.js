let mobile = 'ontouchstart' in document.documentElement;
let bgAudio = null;
let rainAudio = null;

let switchAllowed = false;
let boxClicks = 0;

function openSocial(type) {
    let url = 'about:blank';

    switch (type) {
        case 'discord':
            url = 'https://discord.com/users/1120839953090363402';
            break;
        case 'github':
            url = 'https://www.instagram.com/hazmeics/';
            break;
        case 'twitter':
            url = 'https://www.snapchat.com/@hazmeics';
            break;
    }

    window.open(url);
}

function startIntroTyping() {
    new TypeIt('#intro-text', {
        speed: 50,
    })
        .type('bine ai venit', { delay: 1200 })
        .delete(null, { delay: 1000 })
        .type(`${mobile ? 'tap' : 'apasa orice buton'} sa continui.`)
        .go();

    setTimeout(function () {
        switchAllowed = true;
    }, 2500);
}

function typerStartTyping(typer) {
    typer.reset();

    let text = [
        'luptator',
        'doctor',
        'smecher',
        'interlop',
        'bisnitar',
        'inginer software',
        'profesor',
        'avocat',
        'architect',
        'designer grafic',
        'electrician',
        'mecanic auto',
        'psiholog',
        'contabil',
        'asistent medical',
        'dentist',
        'farmacist',
        'sofer profesionist',
        'pilot',
        'insotitor de zbor',
        'bucatar',
        'chelner',
        'manager de proiect',
        'analist financiar',
        'data scientist',
        'data analyst',
        'devops engineer',
        'inginer hardware',
        'tester software',
        'specialist marketing',
        'copywriter',
        'editor video',
        'fotograf',
        'cameraman',
        'economist',
        'antreprenor',
        'consultant',
        'agent imobiliar',
        'politist',
        'pompier',
        'jandarm',
        'militar',
        'arhivist',
        'bibliotecar',
        'operator call center',
        'inginer civil',
        'inginer mecanic',
        'medic veterinar',
    ];

    text.forEach(function (job) {
        typer.move(null);
        typer.type(job, { delay: 100 });
        typer.pause(100);
        typer.delete(job.length, { delay: 1000 });
    });

    typer.go();
}

function startMainTyping() {
    let typer = new TypeIt('#subtext', {
        speed: 50,
        afterComplete: async () => {
            typerStartTyping(typer);
        },
    });

    typerStartTyping(typer);
}
function fadeInAudio(audio, duration = 2000, targetVolume = 1.0) {
    let startVolume = audio.volume;
    let volumeStep = (targetVolume - startVolume) / (duration / 50);

    let fadeInterval = setInterval(() => {
        startVolume += volumeStep;

        if (startVolume >= targetVolume) {
            startVolume = targetVolume;
            clearInterval(fadeInterval);
        }

        audio.volume = Math.min(startVolume, targetVolume);
    }, 50);
}

function switchScreen() {
    document.title = 'hazar.me | casa';

    $('.intro').fadeOut(1000, function () {
        $('.bg-image').fadeIn(1000);
        $('.main').fadeIn(1000, function () {

            // 🔹 aici facem box-ul vizibil (pornește animația CSS)
            $('.box').addClass('box-visible');

            // pornește textul cu job-urile
            startMainTyping();

            // afișează ceasul doar pe pagina principală
            const cornerClock = document.getElementById('corner-clock');
            if (cornerClock) {
                cornerClock.style.display = 'block';
            }

            // crește volumul melodiei când intri pe main
            if (bgAudio) {
                fadeInAudio(bgAudio, 2000, 1.0);
            }

            // pornește ploaia doar pe pagina principală
            if (rainAudio && rainAudio.paused) {
                rainAudio.currentTime = 0;
                rainAudio.play().catch(() => { });
            }
        });
    });
}


document.addEventListener('keydown', function (e) {
    if (switchAllowed) {
        switchAllowed = false;
        switchScreen();
    }
});

document.addEventListener('touchstart', function (e) {
    if (switchAllowed && mobile) {
        switchAllowed = false;
        switchScreen();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    startIntroTyping();
    document.onselectstart = () => false;

    $('.box').click(() => {
        boxClicks++;
        if (boxClicks === 10) {
            $('.box').fadeOut(1000, () => {
                document.body.requestFullscreen();
            });
        }
    });

    // inițializare audio background + rain
    bgAudio = new Audio('assets/audio/background.mp3');
    bgAudio.loop = true;
    bgAudio.volume = 0.10; // 10% în intro (când începe)

    rainAudio = new Audio('assets/audio/rain.mp3');
    rainAudio.loop = true;
    rainAudio.volume = 0.7;

    // 🔥 Muzica PORNEȘTE LA PRIMA INTERACȚIUNE (tap sau key)
    function introStartAudio() {
        if (bgAudio.paused) {
            bgAudio.play().catch(() => { });
        }
    }

    document.addEventListener('keydown', introStartAudio, { once: true });
    document.addEventListener('touchstart', introStartAudio, { once: true });
});

// ceas colț stânga-jos (actualizează mereu, dar e vizibil doar pe main)
function updateCornerClock() {
    const el = document.getElementById('corner-time');
    if (!el) return;

    const now = new Date();

    let h = String(now.getHours()).padStart(2, '0');
    let m = String(now.getMinutes()).padStart(2, '0');
    let s = String(now.getSeconds()).padStart(2, '0');

    el.textContent = `${h}:${m}:${s}`;
}

setInterval(updateCornerClock, 1000);
updateCornerClock();

// =========================
// CONSTELLAȚIE INTERACTIVĂ
// =========================

function initConstellation() {
    const canvas = document.getElementById('constellation');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    const PARTICLE_COUNT = 80;

    const mouse = {
        x: null,
        y: null,
        active: false,
    };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    function createParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
            });
        }
    }

    createParticles();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // mișcare particule
        for (let p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
        }

        // linii între particule
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];

                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                const MAX_DIST = 140;

                if (dist < MAX_DIST) {
                    const alpha = 1 - dist / MAX_DIST;
                    ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.35})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }

        // desenăm particulele
        for (let p of particles) {
            ctx.fillStyle = 'rgba(255,255,255,0.65)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
            ctx.fill();
        }

        // linii către mouse
        if (mouse.active && mouse.x !== null) {
            const MAX_MOUSE_DIST = 160;

            for (let p of particles) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MAX_MOUSE_DIST) {
                    const alpha = 1 - dist / MAX_MOUSE_DIST;
                    ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.6})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(mouse.x, mouse.y);
                    ctx.lineTo(p.x, p.y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }

    draw();
}

// pornește constelația după ce s-a încărcat tot
window.addEventListener('load', initConstellation);

