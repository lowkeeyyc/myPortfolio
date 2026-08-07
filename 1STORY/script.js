gsap.registerPlugin(ScrollTrigger);

// Progress bar
window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / h) * 100;
    document.getElementById('progress').style.width = scrolled + '%';
});

// Intro animation
gsap.to('#title', { opacity: 1, y: 0, duration: 1.8, ease: 'power3.out', delay: 0.3 });
gsap.to('#subtitle', { opacity: 1, duration: 1.4, delay: 1.1 });

// Reveal all story blocks on scroll
gsap.utils.toArray('.story-block').forEach((block) => {
    gsap.to(block, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: block,
            start: 'top 88%',
            toggleActions: 'play none none none'
        }
    });
});

// Images
gsap.utils.toArray('.img-full').forEach((img) => {
    gsap.to(img, {
        opacity: 1,
        y: 0,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: img,
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });
});

// ========== KITCHEN EFFECTS ==========
const waterAudio = document.getElementById('water-sound');

// Water sound + sink reveal
ScrollTrigger.create({
    trigger: '#sink-scene',
    start: 'top 85%',
    end: 'bottom 20%',
    onEnter: () => {
        waterAudio.currentTime = 0;
        waterAudio.volume = 0.35;
        waterAudio.play().catch(() => { });
    },
    onLeave: () => {
        gsap.to(waterAudio, { volume: 0, duration: 1.2, onComplete: () => waterAudio.pause() });
    },
    onEnterBack: () => {
        waterAudio.volume = 0.35;
        waterAudio.play().catch(() => { });
    },
    onLeaveBack: () => {
        gsap.to(waterAudio, { volume: 0, duration: 0.8, onComplete: () => waterAudio.pause() });
    }
});

// ========== SLOW FRAGMENT SOLIDIFY (bottom → top) ==========
const fragments = gsap.utils.toArray('.fragment');

// reverse order so bottom fragments land first
const ordered = [...fragments].reverse();

ordered.forEach((frag, i) => {
    gsap.to(frag, {
        opacity: 1,
        y: 0,
        scaleY: 1,
        filter: 'blur(0px)',
        duration: 2.8,                    // each piece takes almost 2 seconds
        delay: i * 0.5,                  // big gap between pieces → very slow cascade
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '#sink-scene',
            start: 'top 82%',
            toggleActions: 'play none none reverse'
        }
    });
});

// after all fragments have landed, gently solidify the real image
gsap.to('#img-sink', {
    opacity: 1,
    duration: 2.2,
    delay: ordered.length * 0.38 + 0.6, // waits for the last fragment
    ease: 'power1.inOut',
    scrollTrigger: {
        trigger: '#sink-scene',
        start: 'top 82%',
        toggleActions: 'play none none reverse'
    }
});

// ========== MUCH SLOWER FALLING NARRATION ==========
gsap.utils.toArray('.falling-narration .line').forEach((line, i) => {
    gsap.to(line, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 2.8,                    // each line takes 2.8 s
        delay: 1.8 + i * 0.85,            // long pause between lines
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '#sink-scene',
            start: 'top 78%',
            toggleActions: 'play none none reverse'
        }
    });
});

// Walls self-talk – staggered echo appearance
gsap.utils.toArray('.echo-line').forEach((line) => {
    const delay = parseFloat(line.dataset.delay) || 0;
    gsap.to(line, {
        opacity: 1,
        x: 0,
        duration: 2.0,
        delay: delay,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '#walls-talk',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
    gsap.to(line.querySelector('::before') || line, {
        scale: 1,
        duration: 0.6,
        delay: delay + 0.15,
        scrollTrigger: {
            trigger: '#walls-talk',
            start: 'top 80%'
        }
    });
});

// Tray cascade – falling stairs
gsap.utils.toArray('.tray-item').forEach((item, i) => {
    gsap.to(item, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 3,
        delay: 2.8 + i * 1.85,
        ease: 'back.out(1.4)',
        scrollTrigger: {
            trigger: '#tray-cascade',
            start: 'top 78%',
            toggleActions: 'play none none reverse'
        }
    });
});

// Kettle rapture – sudden appearance + sound
ScrollTrigger.create({
    trigger: '#kettle-rapture',
    start: 'top 75%',
    once: true,
    onEnter: () => {
        // visual
        gsap.to('#kettle-rapture', {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: 'back.out(2)'
        });
        gsap.fromTo('.rapture-flash',
            { opacity: 0, scale: 0.3 },
            {
                opacity: 5, scale: 1.6, duration: 0.5, ease: 'power2.out',
                onComplete: () => gsap.to('.rapture-flash', { opacity: 0, duration: 1.2 })
            }
        );
        gsap.to('.kettle-img', {
            boxShadow: '0 0 80px rgba(196,92,58,0.45)',
            duration: 0.8
        });
    }
});
// ========== KETTLE AUDIO – starts earlier, ends after image leaves ==========
const kettleAudio = document.getElementById('kettle-sound');

// Start the hiss when the previous division (tray cascade) comes into view
ScrollTrigger.create({
    trigger: '#tray-cascade',          // ← previous division
    start: 'top 80%',
    onEnter: () => {
        kettleAudio.currentTime = 0;
        kettleAudio.volume = 0;
        kettleAudio.play().catch(() => { });
        // gentle fade-in
        gsap.to(kettleAudio, { volume: 0.55, duration: 1.5, ease: 'power1.out' });
    },
    onEnterBack: () => {
        kettleAudio.volume = 0.55;
        kettleAudio.play().catch(() => { });
    }
});

// Stop / fade out only after the kettle image has left the viewport
ScrollTrigger.create({
    trigger: '#kettle-rapture',
    start: 'bottom 10%',               // when the bottom of the kettle section is near the top of the screen
    onLeave: () => {
        gsap.to(kettleAudio, {
            volume: 0,
            duration: 1.1,
            ease: 'power1.in',
            onComplete: () => kettleAudio.pause()
        });
    },
    onEnterBack: () => {
        // if user scrolls back up, restore sound
        kettleAudio.volume = 0.55;
        kettleAudio.play().catch(() => { });
    }
});

// ========== BEDROOM PURE TYPE ANIMATIONS ==========

gsap.utils.toArray('#bedroom .type-block').forEach((block) => {
  const isShout  = block.classList.contains('shout');
  const isCrush  = block.classList.contains('crush');
  const isWhisper = block.classList.contains('whisper');
  const isHeavy  = block.classList.contains('heavy');
  const isLong   = block.classList.contains('long');

  let vars = {
    opacity: 1,
    y: 0,
    duration: 1.0,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: block,
      start: 'top 87%',
      toggleActions: 'play none none reverse'
    }
  };

  if (isShout) {
    vars = {
      ...vars,
      duration: 0.8,
      ease: 'back.out(2.2)',
      onStart: () => {
        gsap.fromTo(block.querySelector('.explode'),
          { scale: 0.4, rotate: -12, opacity: 0 },
          { scale: 1, rotate: 0, opacity: 1, duration: 0.85, ease: 'back.out(2)' }
        );
      }
    };
    gsap.set(block, { scale: 0.7 });
  }

  if (isCrush) {
    vars = {
      ...vars,
      duration: 1.4,
      ease: 'power4.out',
      onStart: () => {
        gsap.fromTo(block.querySelector('.crush-text'),
          { y: 60, opacity: 0, filter: 'blur(8px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.3, ease: 'power3.out' }
        );
      }
    };
  }

  if (isWhisper) {
    vars.duration = 1.6;
    vars.ease = 'power1.out';
  }

  if (isHeavy || isLong) {
    vars.duration = 1.3;
  }

  gsap.to(block, vars);
});

// Cascade lines appear one after another
gsap.utils.toArray('.cascade .line').forEach((line, i) => {
  gsap.fromTo(line,
    { opacity: 0, x: -25 },
    {
      opacity: 1,
      x: 0,
      duration: 0.7,
      delay: i * 0.22,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.cascade',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  );
});

// Light beam & detail reveal
ScrollTrigger.create({
    trigger: '#awakening',
    start: 'top 60%',
    onEnter: () => {
        document.getElementById('beam').classList.add('active');
        document.querySelectorAll('.detail-reveal').forEach(el => el.classList.add('visible'));
    }
});

// Scream
gsap.to('#scream', {
    opacity: 1,
    scale: 1,
    duration: 1.2,
    ease: 'back.out(1.4)',
    scrollTrigger: {
        trigger: '#scream',
        start: 'top 80%'
    }
});

// Freedom text + dance
gsap.to('#freedom', {
    opacity: 1,
    duration: 2,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '#freedom',
        start: 'top 75%'
    }
});
gsap.to('#dance', {
    opacity: 1,
    duration: 1.5,
    delay: 0.6,
    scrollTrigger: {
        trigger: '#dance',
        start: 'top 80%'
    }
});

// Final
gsap.to('#final-title', {
    opacity: 1,
    duration: 1.8,
    scrollTrigger: { trigger: '#final', start: 'top 60%' }
});
gsap.to('#final-sub', {
    opacity: 1,
    duration: 1.5,
    delay: 0.4,
    scrollTrigger: { trigger: '#final', start: 'top 60%' }
});

// Subtle parallax on images
gsap.utils.toArray('.img-full').forEach((img) => {
    gsap.to(img, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
});

