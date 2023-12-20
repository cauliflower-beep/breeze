const toggleButton = document.querySelector('.dark-light');
const colors = document.querySelectorAll('.color');
const msgSelected = document.querySelectorAll('.msg');

colors.forEach(color => {
  color.addEventListener('click', e => {
    colors.forEach(c => c.classList.remove('selected'));
    const theme = color.getAttribute('data-color');
    document.body.setAttribute('data-theme', theme);
    color.classList.add('selected');
  });
});

// 左侧消息对象选择脚本
msgSelected.forEach(msg => {
  msg.addEventListener('click', e => {
    msgSelected.forEach(m => m.classList.remove('active'));
    msg.classList.add('active');
  });
});

toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});