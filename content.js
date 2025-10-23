window.autoFillForm = async (mode = "random") => {
  const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randomNumber = (length = 8) =>
    Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
  const randomString = (length = 8) => {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    return Array.from({ length }, () => randomFrom(chars)).join("");
  };
  const randomPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    return Array.from({ length: 10 }, () => randomFrom(chars)).join("");
  };

  const randomName = () => {
    const firstNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Phan", "Đặng"];
    const middleNames = ["Văn", "Thị", "Đình", "Ngọc", "Minh", "Hữu", "Quốc", "Thùy"];
    const lastNames = ["Trường", "An", "Huy", "Hà", "Tuấn", "Trang", "Linh", "Dũng"];
    return `${randomFrom(firstNames)} ${randomFrom(middleNames)} ${randomFrom(lastNames)}`;
  };

  const randomEmail = (username) => {
    const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
    return `${username}${Math.floor(Math.random() * 1000)}@${randomFrom(domains)}`;
  };

  const randomAddress = () => {
    const streets = ["Nguyễn Trãi", "Lý Thường Kiệt", "Trần Hưng Đạo", "Cầu Giấy", "Hoàng Hoa Thám"];
    const cities = ["Hà Nội", "Đà Nẵng", "Hồ Chí Minh", "Hải Phòng", "Cần Thơ"];
    return `${Math.floor(Math.random() * 200)} ${randomFrom(streets)}, ${randomFrom(cities)}`;
  };

  const randomCompany = () => randomFrom(["TechVision", "ToiVaCuocSong", "VietDev", "Sunrise Co", "BlueSky Group"]);
  const randomDistrict = () => randomFrom(["Ba Đình", "Đống Đa", "Thanh Xuân", "Hoàn Kiếm", "Hai Bà Trưng"]);
  const randomSex = () => randomFrom(["Nam", "Nữ"]);
  const randomBirthday = () => {
    const year = 1980 + Math.floor(Math.random() * 25);
    const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, "0");
    const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // ====== Dữ liệu mẫu cố định ======
  const fixedData = {
    username: "truongnd",
    firstName: "Đình",
    lastName: "Trường",
    name: "Nguyễn Đình Trường",
    password: "12345678",
    rePassword: "12345678",
    phone: "0901112233",
    address: "123 Nguyễn Trãi, Hà Nội",
    fax: "0241112233",
    facebook: "https://facebook.com/truongnd",
    email: "truongnd@example.com",
    age: "27",
    year: "1997",
    birthday: "1997-06-28",
    sex: "Nam",
    company: "ToiVaCuocSong",
    city: "Hà Nội",
    district: "Thanh Xuân"
  };

  // ====== Sinh dữ liệu ngẫu nhiên ======
  const randomData = (() => {
    const name = randomName();
    const [firstName, lastName] = name.split(" ").slice(-2);
    const username = (firstName + randomNumber(3)).toLowerCase();
    const password = randomPassword();

    return {
      username,
      firstName,
      lastName,
      name,
      password,
      rePassword: password,
      phone: "09" + randomNumber(8),
      address: randomAddress(),
      fax: "024" + randomNumber(7),
      facebook: `https://facebook.com/${username}`,
      email: randomEmail(username),
      age: String(20 + Math.floor(Math.random() * 20)),
      year: String(1980 + Math.floor(Math.random() * 25)),
      birthday: randomBirthday(),
      sex: randomSex(),
      company: randomCompany(),
      city: "Hà Nội",
      district: randomDistrict(),
    };
  })();

  let data;
  
  if (mode === "random") {
    data = randomData;
  } else if (mode === "custom") {
    // Get custom data from storage
    const result = await chrome.storage.local.get(['customData']);
    const customData = result.customData || {};
    
    // Map custom data to form fields
    data = {
      username: customData.name ? customData.name.toLowerCase().replace(/\s+/g, '') : "user",
      firstName: customData.name ? customData.name.split(' ')[0] : "Tên",
      lastName: customData.name ? customData.name.split(' ').slice(-1)[0] : "Họ",
      name: customData.name || "Nguyễn Văn A",
      password: "12345678",
      rePassword: "12345678",
      phone: customData.phone || "0901234567",
      address: customData.address || "123 Đường ABC",
      fax: "0241234567",
      facebook: `https://facebook.com/${customData.name ? customData.name.toLowerCase().replace(/\s+/g, '') : 'user'}`,
      email: customData.email || "example@email.com",
      age: "25",
      year: "1998",
      birthday: "1998-01-01",
      sex: "Nam",
      company: customData.company || "Công ty ABC",
      city: "Hà Nội",
      district: "Ba Đình"
    };
  } else {
    data = fixedData;
  }

  // ====== Điền dữ liệu vào input ======
  const fillInput = (field, value) => {
    const selectors = [
      `input[name*='${field}']`,
      `input[id*='${field}']`,
      `textarea[name*='${field}']`,
      `textarea[id*='${field}']`,
      `select[name*='${field}']`,
      `select[id*='${field}']`
    ];
    const el = document.querySelector(selectors.join(','));
    if (el) {
      if (el.tagName.toLowerCase() === "select") {
        const option = Array.from(el.options).find(o =>
          o.textContent.toLowerCase().includes(value.toLowerCase())
        );
        if (option) el.value = option.value;
      } else {
        el.value = value;
      }
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  Object.entries(data).forEach(([key, value]) => fillInput(key, value));

  console.table(data);
  console.log(`🎯 Đã tự động điền (${mode === "random" ? "Ngẫu nhiên" : "Cố định"})!`);
};
