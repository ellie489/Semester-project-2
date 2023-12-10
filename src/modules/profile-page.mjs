import { showModal, hideModal } from './modal.mjs';


document.getElementById('avatar-image').addEventListener('click', function () {
 showModal();
});


document.getElementById('close-modal-button').addEventListener('click', function () {
 hideModal();
});
