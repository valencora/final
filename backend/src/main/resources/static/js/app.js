let authToken = null;

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const statusElement = document.getElementById('login-status');

    try {
        const response = await fetch('/api/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            authToken = data.id_token;
            localStorage.setItem('authToken', authToken);
            statusElement.textContent = '✓ Conectado';
            statusElement.style.color = '#28a745';
            document.getElementById('main-content').style.display = 'block';
            loadBlogs();
        } else {
            statusElement.textContent = '✗ Error de autenticación';
            statusElement.style.color = '#dc3545';
        }
    } catch (error) {
        console.error('Error:', error);
        statusElement.textContent = '✗ Error de conexión';
        statusElement.style.color = '#dc3545';
    }
}

// Verificar si hay token guardado al cargar
window.addEventListener('DOMContentLoaded', () => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
        authToken = savedToken;
        document.getElementById('login-status').textContent = '✓ Conectado';
        document.getElementById('login-status').style.color = '#28a745';
        document.getElementById('main-content').style.display = 'block';
        loadBlogs();
    }
});

async function loadBlogs() {
    const blogsList = document.getElementById('blogs-list');
    
    try {
        const response = await fetch('/api/blogs', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const blogs = await response.json();
            displayBlogs(blogs);
        } else if (response.status === 401) {
            authToken = null;
            localStorage.removeItem('authToken');
            document.getElementById('main-content').style.display = 'none';
            document.getElementById('login-status').textContent = 'Sesión expirada. Inicia sesión nuevamente.';
            document.getElementById('login-status').style.color = '#dc3545';
        } else {
            blogsList.innerHTML = '<div class="error-message">Error al cargar los blogs</div>';
        }
    } catch (error) {
        console.error('Error:', error);
        blogsList.innerHTML = '<div class="error-message">Error de conexión al cargar blogs</div>';
    }
}

function displayBlogs(blogs) {
    const blogsList = document.getElementById('blogs-list');
    
    if (blogs.length === 0) {
        blogsList.innerHTML = `
            <div class="empty-state">
                <p>No hay blogs disponibles</p>
                <p style="font-size: 0.9em; color: #999;">Crea tu primer blog usando el botón "Nuevo Blog"</p>
            </div>
        `;
        return;
    }

    blogsList.innerHTML = blogs.map(blog => `
        <div class="blog-card">
            <h3>${escapeHtml(blog.name)}</h3>
            <span class="handle">@${escapeHtml(blog.handle)}</span>
            ${blog.description ? `<p class="description">${escapeHtml(blog.description)}</p>` : ''}
            <div class="actions">
                <button class="btn-danger" onclick="deleteBlog(${blog.id})">Eliminar</button>
            </div>
        </div>
    `).join('');
}

async function createBlog(event) {
    event.preventDefault();
    
    const blog = {
        name: document.getElementById('blog-name').value,
        handle: document.getElementById('blog-handle').value,
        description: document.getElementById('blog-description').value
    };

    try {
        const response = await fetch('/api/blogs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(blog)
        });

        if (response.ok) {
            hideCreateForm();
            document.getElementById('blog-name').value = '';
            document.getElementById('blog-handle').value = '';
            document.getElementById('blog-description').value = '';
            loadBlogs();
        } else {
            alert('Error al crear el blog');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión al crear el blog');
    }
}

async function deleteBlog(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este blog?')) {
        return;
    }

    try {
        const response = await fetch(`/api/blogs/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok || response.status === 204) {
            loadBlogs();
        } else {
            alert('Error al eliminar el blog');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión al eliminar el blog');
    }
}

function showCreateForm() {
    document.getElementById('create-form').style.display = 'block';
}

function hideCreateForm() {
    document.getElementById('create-form').style.display = 'none';
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text ? text.replace(/[&<>"']/g, m => map[m]) : '';
}

