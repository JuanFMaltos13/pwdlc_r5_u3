// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    console.log('Aplicación iniciada');
    
    // ===== CONFIGURACIÓN =====
    var key = '7b5bcadfb01a415099c375b768bf8fee';
    var url = 'https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=' + key;
    
    // ===== ELEMENTOS DEL DOM =====
    var mostrar_noticias = document.getElementById('noticias');
    var loadingIndicator = document.getElementById('loadingIndicator');
    var errorMessage = document.getElementById('errorMessage');
    var modal = document.getElementById('noticiaModal');
    var modalContenido = document.getElementById('modalContenido');
    var refreshBtn = document.getElementById('refreshBtn');
    var closeBtn = document.querySelector('.close');
    
    console.log('📦 Elementos encontrados:', {
        noticias: mostrar_noticias,
        loading: loadingIndicator,
        error: errorMessage,
        modal: modal,
        refreshBtn: refreshBtn
    });

    // ===== FUNCIÓN PARA CARGAR NOTICIAS =====
    function cargarNoticias() {
        console.log('🔄 Cargando noticias...');
        
        // Mostrar loading
        loadingIndicator.style.display = 'block';
        errorMessage.style.display = 'none';
        mostrar_noticias.innerHTML = '';
        
        fetch(url)
            .then(function(resp) {
                if (!resp.ok) {
                    throw new Error('Error al cargar las noticias');
                }
                return resp.json();
            })
            .then(function(dato) {
                console.log('📰 Noticias recibidas:', dato.articles.length);
                
                // Ocultar loading
                loadingIndicator.style.display = 'none';
                
                // Verificar si hay noticias
                if (!dato.articles || dato.articles.length === 0) {
                    throw new Error('No hay noticias disponibles');
                }
                
                var noticias = dato.articles;
                mostrar_noticias.innerHTML = '';
                
                // Recorrer y mostrar cada noticia
                for (var i = 0; i < noticias.length; i++) {
                    var noticia = noticias[i];
                    var div = document.createElement('div');
                    div.className = 'noticia-card';
                    
                    // Valores por defecto
                    var titulo = noticia.title || 'Sin título';
                    var descripcion = noticia.description || 'No hay descripción disponible';
                    var imagen = noticia.urlToImage || 'https://via.placeholder.com/800x400?text=Noticia+Sin+Imagen';
                    var fuente = noticia.source ? noticia.source.name : 'Fuente desconocida';
                    var urlNoticia = noticia.url || '#';
                    var contenido = noticia.content || descripcion;
                    
                    // Escapar caracteres especiales
                    var tituloEscapado = titulo.replace(/'/g, "\\'").replace(/"/g, '&quot;');
                    var contenidoEscapado = contenido.replace(/'/g, "\\'").replace(/"/g, '&quot;');
                    
                    // Formatear fecha
                    var fecha = new Date(noticia.publishedAt);
                    var fechaFormateada = fecha.toLocaleDateString('es-ES');
                    
                    // Hacer clic en toda la tarjeta para abrir el modal
                    div.onclick = function(titulo, contenido, imagen, urlNoticia, fuente) {
                        return function() {
                            console.log('🖱️ Click en noticia:', titulo);
                            abrirModal(titulo, contenido, imagen, urlNoticia, fuente);
                        };
                    }(tituloEscapado, contenidoEscapado, imagen, urlNoticia, fuente);
                    
                    div.innerHTML = 
                        '<img src="' + imagen + '" alt="' + titulo + '" onerror="this.src=\'https://via.placeholder.com/800x400?text=Imagen+No+Disponible\'">' +
                        '<div class="contenido">' +
                            '<h2>' + titulo + '</h2>' +
                            '<p class="descripcion">' + descripcion + '</p>' +
                            '<div class="meta">' +
                                '<span class="fuente">' + fuente + '</span>' +
                                '<span>' + fechaFormateada + '</span>' +
                            '</div>' +
                        '</div>';
                    
                    mostrar_noticias.appendChild(div);
                }
            })
            .catch(function(error) {
                console.error('Error:', error);
                loadingIndicator.style.display = 'none';
                errorMessage.style.display = 'block';
                errorMessage.textContent = '❌' + error.message + '. Intenta nuevamente.';
            });
    }

    // ===== FUNCIÓN PARA ABRIR MODAL =====
    function abrirModal(titulo, contenido, imagen, url, fuente) {
        console.log('📖 Abriendo modal:', titulo);
        var fecha = new Date().toLocaleDateString('es-ES');
        
        modalContenido.innerHTML = 
            '<img src="' + imagen + '" alt="' + titulo + '" onerror="this.src=\'https://via.placeholder.com/800x400?text=Imagen+No+Disponible\'">' +
            '<h2>' + titulo + '</h2>' +
            '<div class="modal-meta">' + fuente + ' | 📅 ' + fecha + '</div>' +
            '<p>' + contenido + '</p>' +
            '<a href="' + url + '" target="_blank" class="modal-link">🔗 Leer artículo completo</a>';
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Hacer la función global para que funcione desde onclick
    window.abrirModal = abrirModal;

    // ===== FUNCIÓN PARA CERRAR MODAL =====
    function cerrarModal() {
        console.log('Cerrando modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    window.cerrarModal = cerrarModal;

    // ===== EVENTOS =====
    // Botón de actualizar
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            console.log('🔄 Click en actualizar');
            cargarNoticias();
        });
    }

    // Botón de cerrar modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            cerrarModal();
        });
    }

    // Cerrar modal al hacer clic fuera
    window.onclick = function(event) {
        if (event.target == modal) {
            cerrarModal();
        }
    };

    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            cerrarModal();
        }
    });

    // ===== INICIAR =====
    cargarNoticias();
});

