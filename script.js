document.addEventListener('DOMContentLoaded', () => {
    const lanzadosGrid = document.getElementById('lanzados-grid');
    const proximosGrid = document.getElementById('proximos-grid');

    // Asegúrate de que la variable 'projects' esté disponible globalmente
    if (typeof projects === 'undefined') {
        console.error('Error: No se pudo cargar la lista de proyectos.');
        return;
    }

    // --- Lógica de Carga de Proyectos ---
    projects.forEach(project => {
        const card = createProjectCard(project);
        if (project.status === 'Lanzado') {
            lanzadosGrid.appendChild(card);
        } else if (project.status === 'Próximo') {
            proximosGrid.appendChild(card);
        }
    });

    // --- Lógica de Scroll Horizontal con Rueda del Ratón ---
    const scrollWrappers = document.querySelectorAll('.horizontal-scroll-wrapper');
    scrollWrappers.forEach(wrapper => {
        wrapper.addEventListener('wheel', (evt) => {
            // Evita el scroll vertical de la página si se puede hacer scroll horizontal
            if (wrapper.scrollWidth > wrapper.clientWidth) {
                evt.preventDefault();
                wrapper.scrollLeft += evt.deltaY;
            }
        });
    });
});

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';

        // --- Contenido de la Tarjeta (con estructura de imagen de 2 capas) ---
        const cardImageWrapper = document.createElement('div');
        cardImageWrapper.className = 'card-image-wrapper';
    
        const backgroundImage = document.createElement('div');
        backgroundImage.className = 'card-image-background';
        backgroundImage.style.backgroundImage = `url(${project.image})`;
        
        const foregroundImage = document.createElement('img');
        foregroundImage.className = 'card-image-foreground';
        foregroundImage.src = project.image;
        foregroundImage.alt = `Imagen de ${project.name}`;
    
        cardImageWrapper.appendChild(backgroundImage);
        cardImageWrapper.appendChild(foregroundImage);
    
        const content = document.createElement('div');
        content.className = 'project-card-content';
        const title = document.createElement('h3');
        title.textContent = project.name;
        const description = document.createElement('p');
        description.textContent = project.description;
        content.appendChild(title);
        content.appendChild(description);
    
        // --- Metadata (Date & Platform) ---
        const metadata = document.createElement('div');
        metadata.className = 'card-metadata';
    
        const date = document.createElement('span');
        date.className = 'meta-date';
        date.textContent = project.launchDate;
        metadata.appendChild(date);
    
        if (project.platforms && project.platforms.length > 0) {
            const platformTags = document.createElement('div');
            platformTags.className = 'platform-tags';
    
            project.platforms.forEach(platform => {
                const platformTag = document.createElement('a');
                platformTag.className = 'platform-tag';
                platformTag.href = platform.url;
                platformTag.target = '_blank';
                platformTag.textContent = platform.name;
                platformTags.appendChild(platformTag);
            });
    
            metadata.appendChild(platformTags);
        }
        
        content.appendChild(metadata);
    
        if (project.link) {
            const link = document.createElement('a');
            link.href = project.link;
            link.textContent = 'Ver Proyecto';
            link.target = '_blank'; // Abrir en nueva pestaña
            content.appendChild(link);
        } else {
            const comingSoonLink = document.createElement('a');
            comingSoonLink.className = 'disabled';
            comingSoonLink.textContent = 'Próximamente';
            content.appendChild(comingSoonLink);
        }
        
        card.appendChild(cardImageWrapper);
        card.appendChild(content);
    // --- Lógica del Efecto 3D Inclinable ---
    const tiltIntensity = 15; // Grados máximos de inclinación

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -tiltIntensity;
        const rotateY = ((x - centerX) / centerX) * tiltIntensity;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    });

    return card;
}