// Đăng ký sự kiện khi nhấn nút ĐĂNG KÝ RA
document.querySelector('button.checkout').addEventListener('click', async function(e) {
    e.preventDefault();

    const btn = this;
    const inputHoTen = document.getElementById('checkout-hoten').value.trim();
    const inputCccd = document.getElementById('checkout-cccd').value.trim();

    // Kiểm tra xem người dùng đã nhập thông tin chưa
    if (!inputHoTen && !inputCccd) {
        alert("Vui lòng nhập ít nhất Họ tên hoặc Số CCCD/HC để thực hiện check-out!");
        return;
    }

    // Hiệu ứng xoay vòng chờ khi đang gửi dữ liệu
    const originalText = btn.innerHTML;
    btn.innerHTML = "Đang xử lý... <i class='fa-solid fa-spinner fa-spin'></i>";
    btn.style.pointerEvents = "none";

    try {
        const response = await fetch(GOOGLE_SHEET_API_URL, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                hoTen: inputHoTen,
                cccd: inputCccd
            })
        });

        if (!response.ok) throw new Error("Không thể kết nối với máy chủ!");

        const result = await response.json();

        if (result.status === "success") {
            alert(`✅ CHECK-OUT THÀNH CÔNG!\nThời gian ra: ${result.timeOut}`);
            // Xóa sạch thông tin trong ô nhập sau khi thành công
            document.getElementById('checkout-hoten').value = "";
            document.getElementById('checkout-cccd').value = "";
        } else {
            alert("❌ THẤT BẠI: " + result.message);
        }

    } catch (error) {
        console.error(error);
        alert("Đã xảy ra lỗi trong quá trình Check-out: " + error.message);
    } finally {
        // Khôi phục trạng thái nút bấm ban đầu
        btn.innerHTML = originalText;
        btn.style.pointerEvents = "auto";
    }
});