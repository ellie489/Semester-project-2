function showModal() {
    document.getElementById('avatar-modal').classList.remove('d-none');
    document.getElementById('modal-overlay').classList.remove('d-none');
  }
   function hideModal() {
    document.getElementById('avatar-modal').classList.add('d-none');
    document.getElementById('modal-overlay').classList.add('d-none');
  }
   // Optionally, close modal when clicking on the overlay
  // document.getElementById('modal-overlay').addEventListener('click', function () {
  //   hideModal();
  // });
   export { showModal, hideModal };