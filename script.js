// Inisialisasi database pengguna
function initializeDatabase() {
    // Cek apakah data pengguna sudah ada di localStorage
    if (!localStorage.getItem('users')) {
        // Data dummy pengguna
        const users = [
            {
                id: 1,
                username: "admin",
                password: "admin123",
                name: "Administrator",
                avatar: "A",
                role: "admin"
            },
            {
                id: 2,
                username: "kurir1",
                password: "kurir123",
                name: "Kurir 1",
                avatar: "K1",
                role: "kurir"
            }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Cek apakah data pembeli sudah ada
    if (!localStorage.getItem('buyers')) {
        const buyers = [
            {
                id: 1,
                name: "Budi Susanto",
                address: "Jl. Merdeka No. 123, Jakarta Selatan",
                whatsappNumber: "6281234567890",
                photo: "https://via.placeholder.com/150?text=Foto+Rumah",
                status: "aktif"
            },
            {
                id: 2,
                name: "Siti Nurhaliza",
                address: "Jl. Diponegoro No. 45, Bandung",
                whatsappNumber: "6281234567891",
                photo: "https://via.placeholder.com/150?text=Foto+Rumah",
                status: "aktif"
            },
            {
                id: 3,
                name: "Andi Pratama",
                address: "Jl. Sudirman No. 67, Surabaya",
                whatsappNumber: "6281234567892",
                photo: "https://via.placeholder.com/150?text=Foto+Rumah",
                status: "aktif"
            },
            {
                id: 4,
                name: "Dewi Lestari",
                address: "Jl. Gatot Subroto No. 89, Yogyakarta",
                whatsappNumber: "6281234567893",
                photo: "https://via.placeholder.com/150?text=Foto+Rumah",
                status: "aktif"
            }
        ];
        localStorage.setItem('buyers', JSON.stringify(buyers));
    }
}

// Fungsi untuk mendapatkan semua pengguna
function getUsers() {
    const usersData = localStorage.getItem('users');
    return usersData ? JSON.parse(usersData) : [];
}

// Fungsi untuk menyimpan pengguna
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Fungsi untuk mendapatkan semua pembeli
function getBuyers() {
    const buyersData = localStorage.getItem('buyers');
    return buyersData ? JSON.parse(buyersData) : [];
}

// Fungsi untuk menyimpan pembeli
function saveBuyers(buyers) {
    localStorage.setItem('buyers', JSON.stringify(buyers));
}

// Data dummy untuk pembeli
let buyers = getBuyers();
let currentUser = null;

// Firebase variables
let firebaseApp = null;
let db = null;
let cloudService = 'firebase';
let isCloudEnabled = false;
let cloudConfig = null;

// DOM Elements
const loginModal = document.getElementById('loginModal');
const appContainer = document.getElementById('appContainer');
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const logoutBtn = document.getElementById('logoutBtn');
const userName = document.getElementById('userName');
const userAvatar = document.getElementById('userAvatar');
const dataBody = document.getElementById('dataBody');
const dataTable = document.getElementById('dataTable');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const addBtn = document.getElementById('addBtn');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const dataForm = document.getElementById('dataForm');
const closeBtn = document.querySelector('.close-btn');
const cancelBtn = document.getElementById('cancelBtn');
const cloudModal = document.getElementById('cloudModal');
const cloudSettingsBtn = document.getElementById('cloudSettingsBtn');
const closeCloudModal = document.getElementById('closeCloudModal');
const saveCloudConfigBtn = document.getElementById('saveCloudConfigBtn');
const cloudOptions = document.querySelectorAll('.cloud-option');
const firebaseConfigJson = document.getElementById('firebaseConfigJson');
const manualSyncBtn = document.getElementById('manualSyncBtn');
const manualSyncMainBtn = document.getElementById('manualSyncMainBtn');
const viewSyncHistoryBtn = document.getElementById('viewSyncHistoryBtn');
const downloadApkBtn = document.getElementById('downloadApkBtn');
const syncIndicatorMain = document.getElementById('syncIndicatorMain');
const syncStatusTextMain = document.getElementById('syncStatusTextMain');
const syncIndicator = document.getElementById('syncIndicator');
const syncStatusText = document.getElementById('syncStatusText');
const toast = document.getElementById('toast');
const userModal = document.getElementById('userModal');
const manageUsersBtn = document.getElementById('manageUsersBtn');
const newUserUsername = document.getElementById('newUsername');
const newUserPassword = document.getElementById('newPassword');
const newName = document.getElementById('newName');
const newRole = document.getElementById('newRole');
const saveUserBtn = document.getElementById('saveUserBtn');
const cancelUserBtn = document.getElementById('cancelUserBtn');
const userMessage = document.getElementById('userMessage');
const photoModal = document.getElementById('photoModal');
const modalPhoto = document.getElementById('modalPhoto');
const photoModalClose = document.querySelector('.photo-modal-close');
const passwordModal = document.getElementById('passwordModal');
const currentPassword = document.getElementById('currentPassword');
const newPasswordChange = document.getElementById('newPasswordChange');
const confirmPassword = document.getElementById('confirmPassword');
const savePasswordBtn = document.getElementById('savePasswordBtn');
const pwdMessage = document.getElementById('pwdMessage');
const changePasswordBtn = document.getElementById('changePasswordBtn');
const viewOnlineBtn = document.getElementById('viewOnlineBtn');
const shareDomainBtn = document.getElementById('shareDomainBtn');
const downloadSourceBtn = document.getElementById('downloadSourceBtn');

// Inisialisasi database dan cloud saat halaman dimuat
initializeDatabase();

// Fungsi untuk menampilkan pesan login
function showLoginMessage(message, isError = true) {
    loginMessage.textContent = message;
    loginMessage.className = 'login-message ' + (isError ? 'error-message' : 'success-message');
    loginMessage.style.display = 'block';
    
    setTimeout(() => {
        loginMessage.style.display = 'none';
    }, 3000);
}

// Fungsi untuk menampilkan toast
function showToast(message, isError = false) {
    toast.textContent = message;
    toast.style.backgroundColor = isError ? '#e74c3c' : '#2c3e50';
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Fungsi untuk login
function login(username, password) {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userAvatar').textContent = user.avatar;
        loginModal.style.display = 'none';
        appContainer.style.display = 'block';
        renderBuyers();
        return true;
    } else {
        showLoginMessage('Username atau password salah!', true);
        return false;
    }
}

// Fungsi untuk logout
function logout() {
    currentUser = null;
    appContainer.style.display = 'none';
    loginModal.style.display = 'flex';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// Fungsi untuk menampilkan data pembeli
function renderBuyers(filteredBuyers = buyers) {
    dataBody.innerHTML = '';
    
    if (filteredBuyers.length === 0) {
        emptyState.style.display = 'block';
        dataTable.style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    dataTable.style.display = 'table';
    
    filteredBuyers.forEach(buyer => {
        const row = document.createElement('tr');
        // Format nomor WhatsApp dengan kode negara
        const formattedNumber = buyer.whatsappNumber ? 
            buyer.whatsappNumber.startsWith('62') ? 
            '+' + buyer.whatsappNumber : 
            '+62' + buyer.whatsappNumber.substring(1) : 
            '';
        
        row.innerHTML = `
            <td class="photo-cell">
                <img src="${buyer.photo}" alt="Foto Rumah" class="photo-preview" data-src="${buyer.photo}">
            </td>
            <td>${buyer.name}</td>
            <td>${buyer.address}</td>
            <td>
                ${buyer.whatsappNumber ? 
                    `<a href="https://wa.me/${buyer.whatsappNumber}" class="whatsapp-number" target="_blank">
                        <i class="fab fa-whatsapp"></i> ${formattedNumber}
                    </a>` : 
                    '-' 
                }
            </td>
            <td><span class="status-badge status-${buyer.status}">${buyer.status}</span></td>
            <td class="action-buttons">
                <button class="action-btn edit-btn" data-id="${buyer.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${buyer.id}">
                    <i class="fas fa-trash"></i>
                </button>
                ${buyer.whatsappNumber ? 
                    `<button class="action-btn whatsapp-btn" data-number="${buyer.whatsappNumber}">
                        <i class="fab fa-whatsapp"></i>
                    </button>` : ''
                }
                ${currentUser.role === 'admin' ? 
                    `<button class="action-btn password-btn" data-id="${buyer.id}">
                        <i class="fas fa-key"></i>
                    </button>` : ''
                }
            </td>
        `;
        dataBody.appendChild(row);
    });
}

// Fungsi untuk menambah data pembeli
function addBuyer() {
    currentAction = 'add';
    modalTitle.textContent = 'Tambah Data Pembeli';
    document.getElementById('buyerId').value = '';
    document.getElementById('name').value = '';
    document.getElementById('address').value = '';
    document.getElementById('whatsappNumber').value = '';
    document.getElementById('photo').value = '';
    modal.style.display = 'flex';
}

// Fungsi untuk mengedit data pembeli
function editBuyer(id) {
    currentAction = 'edit';
    const buyer = buyers.find(b => b.id == id);
    if (buyer) {
        document.getElementById('buyerId').value = buyer.id;
        document.getElementById('name').value = buyer.name;
        document.getElementById('address').value = buyer.address;
        document.getElementById('whatsappNumber').value = buyer.whatsappNumber || '';
        document.getElementById('photo').value = '';
        modalTitle.textContent = 'Edit Data Pembeli';
        modal.style.display = 'flex';
    }
}

// Fungsi untuk menghapus data pembeli
function deleteBuyer(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        buyers = buyers.filter(b => b.id != id);
        saveBuyers(buyers);
        renderBuyers();
        showToast('Data berhasil dihapus');
    }
}

// Fungsi untuk menambah pengguna baru
function addUser() {
    // Hanya admin yang bisa menambah user
    if (currentUser.role !== 'admin') {
        showToast('Hanya admin yang bisa menambah pengguna', true);
        return;
    }
    
    const username = newUserUsername.value.trim();
    const password = newUserPassword.value;
    const name = newName.value.trim();
    const role = newRole.value;
    
    if (!username || !password || !name) {
        showToast('Semua field harus diisi!', true);
        return;
    }
    
    // Cek apakah username sudah ada
    const users = getUsers();
    if (users.some(u => u.username === username)) {
        showToast('Username sudah digunakan!', true);
        return;
    }
    
    // Buat user baru
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = {
        id: newId,
        username: username,
        password: password,
        name: name,
        avatar: name.charAt(0).toUpperCase(),
        role: role
    };
    
    users.push(newUser);
    saveUsers(users);
    
    // Reset form
    newUserUsername.value = '';
    newUserPassword.value = '';
    newName.value = '';
    newRole.value = 'kurir';
    
    showToast('Pengguna berhasil ditambahkan!');
}

// Fungsi update status sinkronisasi
function updateSyncStatus(status, isMain = true) {
    const indicator = isMain ? syncIndicatorMain : syncIndicator;
    const statusText = isMain ? syncStatusTextMain : syncStatusText;
    
    // Reset semua class
    indicator.className = 'indicator';
    statusText.textContent = 'Menunggu sinkronisasi...';
    
    // Set status baru
    if (status === 'syncing') {
        indicator.classList.add('syncing');
        statusText.textContent = 'Sedang sinkronisasi...';
    } else if (status === 'success') {
        indicator.classList.add('success');
        statusText.textContent = 'Sinkronisasi berhasil';
    } else if (status === 'error') {
        indicator.classList.add('error');
        statusText.textContent = 'Sinkronisasi gagal';
    }
}

// Fungsi sinkronisasi manual
function manualSync() {
    if (cloudService === 'none') {
        showToast('Cloud tidak diaktifkan', true);
        return;
    }
    
    if (!isCloudEnabled) {
        showToast('Layanan cloud belum dikonfigurasi', true);
        return;
    }
    
    updateSyncStatus('syncing');
    
    // Simulasi sinkronisasi
    setTimeout(() => {
        updateSyncStatus('success');
        showToast('Data berhasil disinkronkan ke cloud');
    }, 2000);
}

// Inisialisasi Firebase
function initFirebase() {
    // Simulasi inisialisasi Firebase
    console.log("Firebase initialized with config:", cloudConfig);
    showToast('Firebase aktif');
}

// Fungsi sinkronisasi ke cloud
function syncToCloud() {
    if (cloudService === 'none') {
        showToast('Cloud tidak diaktifkan', true);
        return;
    }
    
    updateSyncStatus('syncing');
    
    // Simulasi sinkronisasi ke database
    setTimeout(() => {
        updateSyncStatus('success');
        showToast('Data berhasil disinkronkan ke cloud');
    }, 2000);
}

// Fungsi untuk membuka chat WhatsApp
function openWhatsApp(number) {
    if (number.startsWith('62')) {
        // Jika sudah dimulai dengan 62, gunakan langsung
        window.open('https://wa.me/' + number, '_blank');
    } else if (number.startsWith('0')) {
        // Jika dimulai dengan 0, ubah ke format internasional
        const internationalNumber = '62' + number.substring(1);
        window.open('https://wa.me/' + internationalNumber, '_blank');
    } else {
        // Jika tidak ada prefix, asumsikan 62
        window.open('https://wa.me/' + number, '_blank');
    }
}

// Fungsi untuk mengubah password
function changePassword() {
    passwordModal.style.display = 'flex';
}

// Simpan password baru
function savePassword() {
    const current = currentPassword.value;
    const newPass = newPasswordChange.value;
    const confirm = confirmPassword.value;
    
    // Validasi input
    if (!current || !newPass || !confirm) {
        showPasswordMessage('Semua field harus diisi!', true);
        return;
    }
    
    if (newPass !== confirm) {
        showPasswordMessage('Password baru tidak cocok!', true);
        return;
    }
    
    // Cek jika password saat ini benar
    if (currentUser.password !== current) {
        showPasswordMessage('Password saat ini salah!', true);
        return;
    }
    
    // Update password
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].password = newPass;
        saveUsers(users);
        currentUser.password = newPass;
        showPasswordMessage('Password berhasil diubah!', false);
        setTimeout(() => {
            passwordModal.style.display = 'none';
            currentPassword.value = '';
            newPasswordChange.value = '';
            confirmPassword.value = '';
        }, 2000);
    }
}

// Fungsi untuk menampilkan pesan password
function showPasswordMessage(message, isError = true) {
    pwdMessage.textContent = message;
    pwdMessage.style.backgroundColor = isError ? '#e74c3c' : '#2ecc71';
    pwdMessage.style.color = 'white';
    pwdMessage.style.display = 'block';
    
    setTimeout(() => {
        pwdMessage.style.display = 'none';
    }, 3000);
}

// Buka modal foto
function openPhotoModal(photoUrl) {
    modalPhoto.src = photoUrl;
    photoModal.style.display = 'flex';
}

// Event Listeners untuk Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    login(username, password);
});

// Event Listeners untuk Logout
logoutBtn.addEventListener('click', logout);

// Event Listeners untuk Modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Event Listener untuk Manage Users
manageUsersBtn.addEventListener('click', () => {
    // Hanya admin yang bisa mengakses pengguna
    if (currentUser.role !== 'admin') {
        showToast('Hanya admin yang bisa mengelola pengguna', true);
        return;
    }
    userModal.style.display = 'flex';
});

// Event Listseners untuk User Modal
cancelUserBtn.addEventListener('click', () => {
    userModal.style.display = 'none';
    // Reset form
    newUserUsername.value = '';
    newUserPassword.value = '';
    newName.value = '';
    newRole.value = 'kurir';
});

// Event Listener untuk Simpan User
saveUserBtn.addEventListener('click', addUser);

// Event Listener untuk Cloud Settings
cloudSettingsBtn.addEventListener('click', () => {
    cloudModal.style.display = 'flex';
    
    // Set active cloud option
    document.querySelectorAll('.cloud-option').forEach(option => {
        if (option.dataset.service === cloudService) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
});

// Event Listeners untuk Cloud Options
cloudOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove active class from all options
        cloudOptions.forEach(opt => opt.classList.remove('active'));
        
        // Add active class to clicked option
        option.classList.add('active');
        
        // Set cloud service
        cloudService = option.dataset.service;
        
        // Update config display
        document.querySelectorAll('.cloud-config').forEach(config => {
            config.classList.remove('active');
        });
        
        if (cloudService !== 'none') {
            document.getElementById(`${cloudService}Config`).classList.add('active');
        }
    });
});

// Event Listeners untuk Cloud Modal
closeCloudModal.addEventListener('click', () => {
    cloudModal.style.display = 'none';
});

// Event Listener untuk Simpan Konfigurasi
saveCloudConfigBtn.addEventListener('click', () => {
        if (cloudService === 'none') {
        showToast('Cloud dinonaktifkan');
        isCloudEnabled = false;
    } else {
        const configText = firebaseConfigJson.value.trim();
        try {
            if (configText) {
                cloudConfig = JSON.parse(configText);
                isCloudEnabled = true;
                initFirebase();
            } else {
                showToast('Masukkan konfigurasi Firebase', true);
                return;
            }
        } catch (e) {
            showToast('Format konfigurasi tidak valid', true);
            return;
        }
        
        showToast('Konfigurasi cloud disimpan');
    }
    
    cloudModal.style.display = 'none';
});

// Event Listener untuk Manual Sync
manualSyncBtn.addEventListener('click', manualSync);
manualSyncMainBtn.addEventListener('click', manualSync);

// Event Listener untuk View Sync History
viewSyncHistoryBtn.addEventListener('click', () => {
    showToast('Riwayat sinkronisasi akan ditampilkan di versi aplikasi lengkap');
});

// Event Listener untuk Download APK
downloadApkBtn.addEventListener('click', () => {
    showToast('Mengunduh aplikasi APK...');
    // Simulasikan unduhan
    setTimeout(() => {
        showToast('APK telah siap untuk diunduh. Silakan cek di folder download Anda.');
    }, 1500);
});

// Event Listener untuk View Online
viewOnlineBtn.addEventListener('click', () => {
    showToast('Membuka domain online...');
    // Buka domain dalam tab baru
    window.open('https://manajemen-pembeli.kurir.id', '_blank');
});

// Event Listener untuk Share Domain
shareDomainBtn.addEventListener('click', () => {
    showToast('Menyalin domain ke clipboard...');
    // Salin domain ke clipboard
    navigator.clipboard.writeText('https://manajemen-pembeli.kurir.id').then(() => {
        showToast('Domain telah disalin ke clipboard');
    }).catch(err => {
        showToast('Gagal menyalin domain: ' + err, true);
    });
});

// Event Listener untuk Download Source Code
downloadSourceBtn.addEventListener('click', () => {
    showToast('Mengunduh source code...');
    // Simulasi unduhan source code
    setTimeout(() => {
        showToast('Source code telah disiapkan untuk diunduh');
    }, 1500);
});

// Event Listeners untuk Tombol Tambah
addBtn.addEventListener('click', addBuyer);

// Event Listeners untuk Pencarian
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = buyers.filter(buyer => 
        buyer.name.toLowerCase().includes(searchTerm) ||
        buyer.address.toLowerCase().includes(searchTerm)
    );
    renderBuyers(filtered);
});

// Event Listener untuk Form Data
dataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const whatsappNumber = document.getElementById('whatsappNumber').value;
    const photo = document.getElementById('photo').files[0];
    
    if (currentAction === 'add') {
        // Tambah data baru
        const newId = buyers.length > 0 ? Math.max(...buyers.map(b => b.id)) + 1 : 1;
        buyers.push({
            id: newId,
            name: name,
            address: address,
            whatsappNumber: whatsappNumber,
            photo: photo ? URL.createObjectURL(photo) : "https://via.placeholder.com/150?text=Foto+Rumah",
            status: "aktif"
        });
    } else {
        // Edit data
        const id = parseInt(document.getElementById('buyerId').value);
        const buyerIndex = buyers.findIndex(b => b.id === id);
        if (buyerIndex !== -1) {
            buyers[buyerIndex].name = name;
            buyers[buyerIndex].address = address;
            buyers[buyerIndex].whatsappNumber = whatsappNumber;
            if (photo) {
                buyers[buyerIndex].photo = URL.createObjectURL(photo);
            }
        }
    }
    
    saveBuyers(buyers);
    renderBuyers();
    modal.style.display = 'none';
    showToast('Data berhasil disimpan');
    
    // Sinkronkan ke cloud jika aktif
    if (isCloudEnabled && cloudService !== 'none') {
        syncToCloud();
    }
});

// Event delegation untuk tombol edit, delete, WhatsApp, dan foto
dataBody.addEventListener('click', (e) => {
    if (e.target.closest('.edit-btn')) {
        const id = e.target.closest('.edit-btn').dataset.id;
        editBuyer(id);
    }
    
    if (e.target.closest('.delete-btn')) {
        const id = e.target.closest('.delete-btn').dataset.id;
        deleteBuyer(id);
    }
    
    if (e.target.closest('.whatsapp-btn')) {
        const number = e.target.closest('.whatsapp-btn').dataset.number;
        openWhatsApp(number);
    }
    
    if (e.target.closest('.photo-preview')) {
        const photoUrl = e.target.closest('.photo-preview').dataset.src;
        openPhotoModal(photoUrl);
    }
    
    // Jika klik pada link nomor WhatsApp
    if (e.target.closest('.whatsapp-number')) {
        e.preventDefault();
        const number = e.target.closest('.whatsapp-number').href.split('/').pop();
        openWhatsApp(number);
    }
});

// Event listener untuk photo modal close
photoModalClose.addEventListener('click', () => {
    photoModal.style.display = 'none';
});

// Event listener untuk klik di luar photo modal untuk menutup
photoModal.addEventListener('click', (e) => {
    if (e.target === photoModal) {
        photoModal.style.display = 'none';
    }
});

// Event listener untuk password change modal
changePasswordBtn.addEventListener('click', changePassword);

// Event listener untuk simpan password
savePasswordBtn.addEventListener('click', savePassword);

// Event listener untuk close password modal
document.querySelector('#passwordModal .close-btn').addEventListener('click', () => {
    passwordModal.style.display = 'none';
    currentPassword.value = '';
    newPasswordChange.value = '';
    confirmPassword.value = '';
    pwdMessage.style.display = 'none';
});

// Inisialisasi - Tampilkan login modal
loginModal.style.display = 'flex';

// Set document title
document.title = "Manajemen Pembeli - Kurir";

// Add viewport meta for mobile
const viewportMeta = document.createElement('meta');
viewportMeta.name = 'viewport';
viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
document.head.appendChild(viewportMeta);

// Simulasi auto sync
setInterval(() => {
    if (isCloudEnabled && cloudService !== 'none') {
        // Update sync status for demo
        updateSyncStatus('success');
    }
}, 30000); // Setiap 30 detik

