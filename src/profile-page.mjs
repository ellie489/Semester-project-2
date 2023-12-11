import { showModal, hideModal } from './modules/modal.mjs';


document.getElementById('profile-avatar').addEventListener('click', function () {
 showModal();
});


document.getElementById('close-modal-button').addEventListener('click', function () {
 hideModal();
});
