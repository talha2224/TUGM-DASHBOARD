import React, { useState } from 'react';
import AuthImage from '../../assets/auth/auth.png';
import Logo from '../../assets/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import config from '../../config';
import toast from 'react-hot-toast';
import axios from 'axios';

const RegisterPage = () => {
  const nav = useNavigate();
  const [formData, setFormData] = useState({ firstName: '', middleName: '', lastName: '', email: '', phone: '', dob: '', address: '', otherAddressInfo: '', country: '', zipCode: '', state: '', city: '', password: '', refferalCode: '', });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'country') {
      setStates(getStates(value));
      setCities([]);
      setFormData({ ...formData, country: value, state: '', city: '' });
    }
    if (name === 'state') {
      setCities(getCities(formData.country, value));
      setFormData({ ...formData, state: value, city: '' });
    }
  };
  const validatePhoneNumber = (phoneNumber, country) => {
    if (country === 'USA') {
      const usaRegex = /^\d{10}$/;
      return usaRegex.test(phoneNumber);
    }
    else if (country === 'Vietnam') {
      const vietnamRegex = /^0\d{9,10}$/;
      return vietnamRegex.test(phoneNumber);
    }
    return false;
  }

  const handleRegistration = async () => {
    const requiredFields = ['firstName', 'middleName', 'lastName', 'email', 'phone', 'dob', 'address', 'country', 'state', 'city', 'zipCode', 'password',];

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in the ${field} field.`);
        return;
      }
    }
    if (!validatePhoneNumber(formData.phone, formData.country)) {
      toast.error(formData.country === 'USA'? 'Please enter a valid 10-digit USA phone number.': formData.country === 'Vietnam'? 'Please enter a valid 10 or 11-digit Vietnam phone number starting with 0.': 'Please select a country and enter a valid phone number.');
      return;
  }
    let loader = toast.loading('Processing');
    try {
      const response = await axios.post(`${config.baseUrl}/account/register`, formData);
      if (response?.data) {
        toast.dismiss(loader);
        localStorage.setItem('uId', response?.data?.data?._id);
        localStorage.setItem('uEmail', response?.data?.data?.email);
        toast.success('Registration successful!');
        setTimeout(() => {
          nav('/verify');
        }, 2000);
      }
    }
    catch (error) {
      toast.dismiss(loader);
      if (error.response) {
        toast.error(error?.response?.data?.msg || 'Registration failed. Please try again.');
      } else if (error.request) {
        toast.error('No response received from the server. Please try again.');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  const getStates = (country) => {
    const stateData = {
      Vietnam: [
        'An Giang', 'Ba Ria-Vung Tau', 'Bac Giang', 'Bac Kan', 'Bac Lieu', 'Bac Ninh',
        'Ben Tre', 'Binh Dinh', 'Binh Duong', 'Binh Phuoc', 'Binh Thuan', 'Ca Mau',
        'Can Tho', 'Cao Bang', 'Da Nang', 'Dak Lak', 'Dak Nong', 'Dien Bien', 'Dong Nai',
        'Dong Thap', 'Gia Lai', 'Ha Giang', 'Ha Nam', 'Ha Noi', 'Ha Tinh', 'Hai Duong',
        'Hai Phong', 'Hau Giang', 'Hoa Binh', 'Hung Yen', 'Khanh Hoa', 'Kien Giang',
        'Kon Tum', 'Lai Chau', 'Lam Dong', 'Lang Son', 'Lao Cai', 'Long An', 'Nam Dinh',
        'Nghe An', 'Ninh Binh', 'Ninh Thuan', 'Phu Tho', 'Phu Yen', 'Quang Binh',
        'Quang Nam', 'Quang Ngai', 'Quang Ninh', 'Quang Tri', 'Soc Trang', 'Son La',
        'Tay Ninh', 'Thai Binh', 'Thai Nguyen', 'Thanh Hoa', 'Thua Thien Hue', 'Tien Giang',
        'Tra Vinh', 'Tuyen Quang', 'Vinh Long', 'Vinh Phuc', 'Yen Bai'
      ],
      USA: [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
        'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
        'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
        'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
        'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
        'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
        'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
        'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
      ]
    };
    return stateData[country] || [];
  };

  const getCities = (country, state) => {
    const cityData = {
      Vietnam: {
        'An Giang': ['Long Xuyen', 'Chau Doc', 'Tan Chau', 'Chau Phu', 'Cho Moi', 'Phu Tan', 'Thoai Son', 'Tri Ton', 'Tinh Bien', 'An Phu', 'Chợ Mới'],
        'Ba Ria-Vung Tau': ['Vung Tau', 'Ba Ria', 'Phu My', 'Con Dao', 'Long Dien', 'Dat Do', 'Tan Thanh', 'Chau Duc'],
        'Bac Giang': ['Bac Giang', 'Yen The', 'Tan Yen', 'Lang Giang', 'Luc Ngan', 'Luc Nam', 'Son Dong', 'Hiep Hoa', 'Viet Yen', 'Yen Dung'],
        'Bac Kan': ['Bac Kan', 'Cho Don', 'Na Ri', 'Ngan Son', 'Ba Be', 'Pach Nam', 'Ngan Son'],
        'Bac Lieu': ['Bac Lieu', 'Gia Rai', 'Dong Hai', 'Hoa Binh', 'Vinh Loi', 'Phuoc Long'],
        'Bac Ninh': ['Bac Ninh', 'Tu Son', 'Thuan Thanh', 'Gia Binh', 'Que Vo', 'Tien Du', 'Yen Phong', 'Luong Tai'],
        'Ben Tre': ['Ben Tre', 'Giong Trom', 'Binh Dai', 'Ba Tri', 'Thanh Phu', 'Mo Cay Nam', 'Mo Cay Bac', 'Chau Thanh', 'Cho Lach'],
        'Binh Dinh': ['Quy Nhon', 'An Nhon', 'An Khe', 'Hoai Nhon', 'Tay Son', 'Phu Cat', 'Vinh Thanh', 'Van Canh', 'Phu My', 'Hoai An'],
        'Binh Duong': ['Thu Dau Mot', 'Thuan An', 'Di An', 'Ben Cat', 'Tan Uyen', 'Bac Tan Uyen', 'Phu Giao', 'Dau Tieng', 'Bàu Bàng'],
        'Binh Phuoc': ['Dong Xoai', 'Binh Long', 'Phuoc Long', 'Bu Dop', 'Bu Gia Map', 'Loc Ninh', 'Bu Dang', 'Dong Phu', 'Chon Thanh', 'Hon Quan', 'Phu Rieng'],
        'Binh Thuan': ['Phan Thiet', 'La Gi', 'Tuy Phong', 'Bac Binh', 'Ham Thuan Bac', 'Ham Thuan Nam', 'Tanh Linh', 'Ham Tan', 'Phu Quy', 'Đức Linh'],
        'Ca Mau': ['Ca Mau', 'Nam Can', 'Cai Nuoc', 'U Minh', 'Tran Van Thoi', 'Thoi Binh', 'Phu Tan', 'Dam Doi', 'Năm Căn'],
        'Can Tho': ['Can Tho', 'O Mon', 'Thot Not', 'Vinh Thanh', 'Co Do', 'Phong Dien', 'Cai Rang', 'Thoi Lai', 'Cờ Đỏ'],
        'Cao Bang': ['Cao Bang', 'Bao Lac', 'Bao Lam', 'Ha Quang', 'Trung Khanh', 'Quang Uyen', 'Phuc Hoa', 'Nguyen Binh', 'Thach An', 'Ha Lang', 'Tra Linh', 'Hòa An'],
        'Da Nang': ['Da Nang', 'Lien Chieu', 'Thanh Khe', 'Hai Chau', 'Son Tra', 'Ngu Hanh Son', 'Cam Le', 'Hoa Vang', 'Hoang Sa'],
        'Dak Lak': ['Buon Ma Thuot', 'Ea H\'leo', 'Krong Buk', 'Krong Nang', 'Cu M\'gar', 'Krong Pak', 'Ea Kar', 'M\'Drak', 'Krong Bong', 'Lak', 'Buon Don', 'Cu Kuin', 'Krông Ana'],
        'Dak Nong': ['Gia Nghia', 'Dak Glong', 'Cu Jut', 'Dak Mil', 'Krong No', 'Dak Song', 'Tuy Duc', 'Dak R\'lap'],
        'Dien Bien': ['Dien Bien Phu', 'Muong Lay', 'Dien Bien Dong', 'Muong Nhe', 'Tua Chua', 'Tuan Giao', 'Dien Bien', 'Nam Po', 'Muong Ang', 'Điện Biên'],
        'Dong Nai': ['Bien Hoa', 'Long Khanh', 'Tan Phu', 'Dinh Quan', 'Thong Nhat', 'Trang Bom', 'Long Thanh', 'Vinh Cuu', 'Xuan Loc', 'Cam My', 'Nhơn Trạch'],
        'Dong Thap': ['Cao Lanh', 'Sa Dec', 'Hong Ngu', 'Tan Hong', 'Thanh Binh', 'Tam Nong', 'Lai Vung', 'Lap Vo', 'Cao Lãnh', 'Hong Ngu', 'Chau Thanh', 'Thap Muoi'],
        'Gia Lai': ['Pleiku', 'An Khe', 'Ayun Pa', 'KBang', 'KPa', 'Dak Po', 'Chu Pah', 'Ia Grai', 'Mang Yang', 'Kong Chro', 'Duc Co', 'Chu Se', 'Dak Doa', 'Phu Thien', 'Ia Pa', 'Krong Pa', 'Phú Thiện'],
        'Ha Giang': ['Ha Giang', 'Dong Van', 'Meo Vac', 'Yen Minh', 'Quan Ba', 'Bac Me', 'Vi Xuyen', 'Hoang Su Phi', 'Xin Man', 'Bac Quang', 'Quang Binh'],
        'Ha Nam': ['Phu Ly', 'Duy Tien', 'Kim Bang', 'Ly Nhan', 'Thanh Liem', 'Binh Luc'],
        'Ha Noi': ['Ha Noi', 'Dong Da', 'Ba Dinh', 'Hoan Kiem', 'Hai Ba Trung', 'Tay Ho', 'Thanh Xuan', 'Cau Giay', 'Long Bien', 'Hoang Mai', 'Ha Dong', 'Dong Anh', 'Gia Lam', 'Thanh Tri', 'Me Linh', 'Son Tay', 'Ba Vi', 'Phuc Tho', 'Dan Phuong', 'Hoai Duc', 'Quoc Oai', 'Thach That', 'Chuong My', 'Thuong Tin', 'Phu Xuyen', 'My Duc', 'Ung Hoa', 'Thanh Oai', 'Soc Son'],
        'Ha Tinh': ['Ha Tinh', 'Hong Linh', 'Ky Anh', 'Huong Son', 'Duc Tho', 'Nghi Xuan', 'Can Loc', 'Huong Khe', 'Thach Ha', 'Ky Anh', 'Loc Ha', 'Cẩm Xuyên'],
        'Hai Duong': ['Hai Duong', 'Chi Linh', 'Kinh Mon', 'Nam Sach', 'Kim Thanh', 'Thanh Ha', 'Cam Giang', 'Binh Giang', 'Gia Loc', 'Tu Ky', 'Ninh Giang', 'Thanh Mien'],
        'Hai Phong': ['Hai Phong', 'Do Son', 'Kien An', 'Hai An', 'Le Chan', 'Hong Bang', 'Ngo Quyen', 'Kien Thuy', 'An Lao', 'Thuy Nguyen', 'An Duong', 'Tien Lang', 'Cat Hai', 'Bach Long Vi', 'Vĩnh Bảo'],
        'Hau Giang': ['Vi Thanh', 'Nga Bay', 'Long My', 'Vi Thuy', 'Phung Hiep', 'Chau Thanh', 'Chau Thanh A'],
        'Hoa Binh': ['Hoa Binh', 'Cao Phong', 'Ky Son', 'Luong Son', 'Mai Chau', 'Tan Lac', 'Da Bac', 'Yen Thuy', 'Lac Thuy', 'Lac Son', 'Kim Boi'],
        'Hung Yen': ['Hung Yen', 'My Hao', 'Van Lam', 'Van Giang', 'Yen My', 'Khoai Chau', 'Kim Dong', 'Tien Lu', 'Phu Cu', 'Ân Thi'],
        'Khanh Hoa': ['Nha Trang', 'Cam Ranh', 'Ninh Hoa', 'Van Ninh', 'Dien Khanh', 'Khanh Vinh', 'Khanh Son', 'Truong Sa', 'Vạn Ninh'],
        'Kien Giang': ['Rach Gia', 'Ha Tien', 'Phu Quoc', 'Kien Luong', 'Hon Dat', 'Tan Hiep', 'Chau Thanh', 'Giong Rieng', 'Go Quao', 'An Bien', 'An Minh', 'Vinh Thuan', 'U Minh Thuong', 'Giang Thanh'],
        'Kon Tum': ['Kon Tum', 'Dak Glei', 'Ngoc Hoi', 'Dak To', 'Kon Plong', 'Kon Ray', 'Dak Ha', 'Sa Thay', 'Ia H\'Drai'],
        'Lai Chau': ['Lai Chau', 'Muong Te', 'Sin Ho', 'Phong Tho', 'Tam Duong', 'Than Uyen', 'Tan Uyen', 'Nậm Nhùn'],
        'Lam Dong': ['Da Lat', 'Bao Loc', 'Da Huoai', 'Da Teh', 'Don Duong', 'Duc Trong', 'Lac Duong', 'Lam Ha', 'Bao Lam', 'Di Linh', 'Cat Tien', 'Đạ Tẻh'],
        'Lang Son': ['Lang Son', 'Bac Son', 'Binh Gia', 'Cao Loc', 'Chi Lang', 'Dinh Lap', 'Huu Lung', 'Loc Binh', 'Trang Dinh', 'Van Lang', 'Van Quan'],
        'Lao Cai': ['Lao Cai', 'Bat Xat', 'Bao Yen', 'Bao Thang', 'Sa Pa', 'Van Ban', 'Muong Khuong', 'Bac Ha', 'Si Ma Cai'],
        'Long An': ['Tan An', 'Kien Tuong', 'Tan Hung', 'Vinh Hung', 'Moc Hoa', 'Tan Thanh', 'Duc Hue', 'Duc Hoa', 'Ben Luc', 'Thu Thua', 'Can Duoc', 'Can Giuoc', 'Chau Thanh', 'Tan Tru', 'Đức Hòa'],
        'Nam Dinh': ['Nam Dinh', 'Nam Truc', 'Truc Ninh', 'Xuan Truong', 'Nghia Hung', 'Hai Hau', 'Y Yen', 'Vu Ban', 'My Loc', 'Nam Giang'],
        'Nghe An': ['Vinh', 'Cua Lo', 'Thai Hoa', 'Hoang Mai', 'Quynh Luu', 'Dien Chau', 'Yen Thanh', 'Do Luong', 'Nam Dan', 'Nghi Loc', 'Hung Nguyen', 'Tan Ky', 'Anh Son', 'Con Cuong', 'Quy Chau', 'Quy Hop', 'Nghia Dan', 'Quy', 'Son', 'Tuong Duong', 'Ky Son', 'Thanh Chuong', 'Que Phong', 'Thái Hòa'],
        'Ninh Binh': ['Ninh Binh', 'Tam Diep', 'Gia Vien', 'Hoa Lu', 'Kim Son', 'Nho Quan', 'Yen Khanh', 'Yen Mo'],
        'Ninh Thuan': ['Phan Rang-Thap Cham', 'Bac Ai', 'Ninh Son', 'Ninh Hai', 'Thuan Bac', 'Thuan Nam', 'Ninh Phuoc'],
        'Phu Tho': ['Viet Tri', 'Phu Tho', 'Doan Hung', 'Ha Hoa', 'Cam Khe', 'Yen Lap', 'Thanh Ba', 'Phu Ninh', 'Lam Thao', 'Tam Nong', 'Thanh Son', 'Tan Son', 'Hạ Hòa'],
        'Phu Yen': ['Tuy Hoa', 'Song Cau', 'Dong Xuan', 'Tuy An', 'Phu Hoa', 'Son Hoa', 'Dong Hoa', 'Tay Hoa', 'Sông Cầu'],
        'Quang Binh': ['Dong Hoi', 'Minh Hoa', 'Tuyen Hoa', 'Quang Trach', 'Bo Trach', 'Quang Ninh', 'Le Thuy', 'Ba Don', 'Ba Đồn'],
        'Quang Nam': ['Tam Ky', 'Hoi An', 'Dien Ban', 'Que Son', 'Dai Loc', 'Duy Xuyen', 'Thang Binh', 'Phu Ninh', 'Nam Giang', 'Phuoc Son', 'Hiep Duc', 'Tien Phuoc', 'Nui Thanh', 'Bac Tra My', 'Nam Tra My', 'Tay Giang', 'Đại Lộc'],
        'Quang Ngai': ['Quang Ngai', 'Binh Son', 'Tra Bong', 'Tu Nghia', 'Son Tinh', 'Nghia Hanh', 'Mo Duc', 'Duc Pho', 'Ba To', 'Ly Son', 'Son Tay', 'Son Ha', 'Minh Long', 'Đức Phổ'],
        'Quang Ninh': ['Ha Long', 'Mong Cai', 'Cam Pha', 'Uong Bi', 'Quang Yen', 'Dong Trieu', 'Tien Yen', 'Dam Ha', 'Hai Ha', 'Binh Lieu', 'Ba Che', 'Co To', 'Đông Triều'],
        'Quang Tri': ['Dong Ha', 'Quang Tri', 'Vinh Linh', 'Gio Linh', 'Trieu Phong', 'Hai Lang', 'Huong Hoa', 'Dak Rong', 'Con Co'],
        'Soc Trang': ['Soc Trang', 'Nga Nam', 'Vinh Chau', 'My Xuyen', 'Long Phu', 'Cu Lao Dung', 'Ke Sach', 'Thanh Tri', 'Tran De', 'My Tu', 'Ngã Năm'],
        'Son La': ['Son La', 'Quynh Nhai', 'Muong La', 'Thuan Chau', 'Bac Yen', 'Phu Yen', 'Moc Chau', 'Yen Chau', 'Mai Son', 'Song Ma', 'Sop Cop', 'Van Ho'],
        'Tay Ninh': ['Tay Ninh', 'Tan Bien', 'Tan Chau', 'Duong Minh Chau', 'Chau Thanh', 'Hoa Thanh', 'Go Dau', 'Ben Cau', 'Trang Bang'],
        'Thai Binh': ['Thai Binh', 'Quynh Phu', 'Hung Ha', 'Dong Hung', 'Thai Thuy', 'Tien Hai', 'Kien Xuong', 'Vu Thu'],
        'Thai Nguyen': ['Thai Nguyen', 'Song Cong', 'Pho Yen', 'Dinh Hoa', 'Phu Luong', 'Vo Nhai', 'Dai Tu', 'Phu Binh', 'Pho Yen', 'Song Công'],
        'Thanh Hoa': ['Thanh Hoa', 'Bim Son', 'Sam Son', 'Nghi Son', 'Muong Lat', 'Quan Son', 'Quan Hoa', 'Lang Chanh', 'Ba Thuoc', 'Cam Thuy', 'Thach Thanh', 'Yen Dinh', 'Tho Xuan', 'Thuong Xuan', 'Trieu Son', 'Dong Son', 'Ha Trung', 'Vinh Loc', 'Yen Dinh', 'Hoang Hoa', 'Nong Cong', 'Tĩnh Gia', 'Bỉm Sơn'],
        'Thua Thien Hue': ['Hue', 'Huong Thuy', 'Huong Tra', 'A Luoi', 'Phong Dien', 'Quang Dien', 'Phu Loc', 'Phu Vang', 'Nam Dong', 'Kỳ Anh'],
        'Tien Giang': ['My Tho', 'Go Cong', 'Cai Lay', 'Tan Phuoc', 'Chau Thanh', 'Cho Gao', 'Tan Thanh', 'Go Cong Tay', 'Go Cong Dong', 'Cai Be', 'Cai Lậy'],
        'Tra Vinh': ['Tra Vinh', 'Duyen Hai', 'Cau Ke', 'Tieu Can', 'Chau Thanh', 'Tra Cu', 'Cang Long', 'Cau Ngang', 'Duyên Hải'],
        'Tuyen Quang': ['Tuyen Quang', 'Na Hang', 'Chiem Hoa', 'Ham Yen', 'Yen Son', 'Son Duong', 'Lam Binh'],
        'Vinh Long': ['Vinh Long', 'Binh Minh', 'Long Ho', 'Mang Thit', 'Vung Liem', 'Tam Binh', 'Tra On', 'Binh Tan', 'Bình Minh'],
        'Vinh Phuc': ['Vinh Yen', 'Phuc Yen', 'Lap Thach', 'Vinh Tuong', 'Tam Duong', 'Tam Dao', 'Binh Xuyen', 'Yen Lac', 'Song Lo', 'Phúc Yên'],
        'Yen Bai': ['Yen Bai', 'Nghia Lo', 'Luc Yen', 'Van Yen', 'Mu Cang Chai', 'Tran Yen', 'Tram Tau', 'Yen Binh', 'Van Chan', 'Nghĩa Lộ']
      },
      USA: {
        'Alabama': ['Birmingham', 'Montgomery', 'Huntsville', 'Mobile', 'Tuscaloosa', 'Hoover', 'Auburn', 'Decatur', 'Dothan', 'Madison'],
        'Alaska': ['Anchorage', 'Juneau', 'Fairbanks', 'Eagle River', 'College', 'Sitka', 'Ketchikan', 'Wasilla', 'Palmer', 'Kenai'],
        'Arizona': ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale', 'Glendale', 'Gilbert', 'Tempe', 'Peoria', 'Surprise'],
        'Arkansas': ['Little Rock', 'Fort Smith', 'Fayetteville', 'Springdale', 'Jonesboro', 'Conway', 'Rogers', 'Pine Bluff', 'Bentonville', 'Hot Springs'],
        'California': ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Fresno', 'Sacramento', 'Long Beach', 'Oakland', 'Bakersfield', 'Anaheim'],
        'Colorado': ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Lakewood', 'Thornton', 'Arvada', 'Westminster', 'Pueblo', 'Centennial'],
        'Connecticut': ['Bridgeport', 'New Haven', 'Stamford', 'Hartford', 'Waterbury', 'Norwalk', 'Danbury', 'New Britain', 'West Hartford', 'Bristol'],
        'Delaware': ['Wilmington', 'Dover', 'Newark', 'Middletown', 'Smyrna', 'Bear', 'Glasgow', 'Brookside', 'Hockessin', 'Pike Creek'],
        'Florida': ['Jacksonville', 'Miami', 'Tampa', 'Orlando', 'St. Petersburg', 'Hialeah', 'Tallahassee', 'Fort Lauderdale', 'Port St. Lucie', 'Cape Coral'],
        'Georgia': ['Atlanta', 'Columbus', 'Augusta', 'Macon', 'Savannah', 'Athens', 'Sandy Springs', 'Roswell', 'Johns Creek', 'Albany'],
        'Hawaii': ['Honolulu', 'Hilo', 'Kailua', 'Pearl City', 'Kahului', 'Kaneohe', 'Kihei', 'Mililani', 'Waipahu', 'Ewa Beach'],
        'Idaho': ['Boise', 'Meridian', 'Nampa', 'Idaho Falls', 'Pocatello', 'Caldwell', 'Coeur d\'Alene', 'Twin Falls', 'Rexburg', 'Eagle'],
        'Illinois': ['Chicago', 'Aurora', 'Rockford', 'Joliet', 'Naperville', 'Springfield', 'Peoria', 'Elgin', 'Waukegan', 'Champaign'],
        'Indiana': ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Carmel', 'Bloomington', 'Fishers', 'Hammond', 'Gary', 'Lafayette'],
        'Iowa': ['Des Moines', 'Cedar Rapids', 'Davenport', 'Sioux City', 'Waterloo', 'Council Bluffs', 'Ames', 'Dubuque', 'Ankeny', 'Urbandale'],
        'Kansas': ['Wichita', 'Overland Park', 'Kansas City', 'Olathe', 'Topeka', 'Lawrence', 'Shawnee', 'Manhattan', 'Lenexa', 'Salina'],
        'Kentucky': ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro', 'Covington', 'Hopkinsville', 'Richmond', 'Florence', 'Georgetown', 'Henderson'],
        'Louisiana': ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette', 'Lake Charles', 'Kenner', 'Bossier City', 'Monroe', 'Alexandria', 'Houma'],
        'Maine': ['Portland', 'Lewiston', 'Bangor', 'South Portland', 'Auburn', 'Biddeford', 'Sanford', 'Saco', 'Westbrook', 'Augusta'],
        'Maryland': ['Baltimore', 'Columbia', 'Germantown', 'Silver Spring', 'Waldorf', 'Glen Burnie', 'Ellicott City', 'Frederick', 'Rockville', 'Gaithersburg'],
        'Massachusetts': ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell', 'Brockton', 'Quincy', 'Lynn', 'New Bedford', 'Fall River'],
        'Michigan': ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor', 'Lansing', 'Dearborn', 'Livonia', 'Troy', 'Westland'],
        'Minnesota': ['Minneapolis', 'Saint Paul', 'Rochester', 'Duluth', 'Bloomington', 'Brooklyn Park', 'Plymouth', 'St. Cloud', 'Eagan', 'Woodbury'],
        'Mississippi': ['Jackson', 'Gulfport', 'Southaven', 'Hattiesburg', 'Biloxi', 'Meridian', 'Tupelo', 'Greenville', 'Olive Branch', 'Columbus'],
        'Missouri': ['Kansas City', 'St. Louis', 'Springfield', 'Independence', 'Columbia', 'Lee\'s Summit', 'O\'Fallon', 'St. Joseph', 'St. Charles', 'Blue Springs'],
        'Montana': ['Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Butte', 'Helena', 'Kalispell', 'Anaconda', 'Havre', 'Miles City'],
        'Nebraska': ['Omaha', 'Lincoln', 'Bellevue', 'Grand Island', 'Kearney', 'Fremont', 'Hastings', 'Norfolk', 'Columbus', 'Papillion'],
        'Nevada': ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Sparks', 'Carson City', 'Fernley', 'Elko', 'Boulder City', 'Mesquite'],
        'New Hampshire': ['Manchester', 'Nashua', 'Concord', 'Derry', 'Rochester', 'Salem', 'Dover', 'Keene', 'Portsmouth', 'Merrimack'],
        'New Jersey': ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Edison', 'Woodbridge', 'Lakewood', 'Toms River', 'Hamilton', 'Trenton'],
        'New Mexico': ['Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe', 'Roswell', 'Farmington', 'South Valley', 'Clovis', 'Hobbs', 'Alamogordo'],
        'New York': ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany', 'New Rochelle', 'Mount Vernon', 'Schenectady', 'Utica'],
        'North Carolina': ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem', 'Fayetteville', 'Cary', 'Wilmington', 'High Point', 'Greenville'],
        'North Dakota': ['Fargo', 'Bismarck', 'Grand Forks', 'Minot', 'West Fargo', 'Mandan', 'Dickinson', 'Jamestown', 'Williston', 'Wahpeton'],
        'Ohio': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton', 'Parma', 'Canton', 'Youngstown', 'Lorain'],
        'Oklahoma': ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Lawton', 'Edmond', 'Moore', 'Midwest City', 'Enid', 'Stillwater'],
        'Oregon': ['Portland', 'Eugene', 'Salem', 'Gresham', 'Hillsboro', 'Beaverton', 'Bend', 'Medford', 'Springfield', 'Corvallis'],
        'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading', 'Scranton', 'Bethlehem', 'Lancaster', 'Harrisburg', 'Altoona'],
        'Rhode Island': ['Providence', 'Cranston', 'Warwick', 'Pawtucket', 'East Providence', 'Woonsocket', 'Cumberland', 'Coventry', 'North Providence', 'Bristol'],
        'South Carolina': ['Columbia', 'Charleston', 'North Charleston', 'Mount Pleasant', 'Rock Hill', 'Greenville', 'Summerville', 'Sumter', 'Hilton Head Island', 'Spartanburg'],
        'South Dakota': ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Watertown', 'Brookings', 'Mitchell', 'Yankton', 'Pierre', 'Huron', 'Vermillion'],
        'Tennessee': ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Clarksville', 'Murfreesboro', 'Franklin', 'Johnson City', 'Jackson', 'Hendersonville'],
        'Texas': ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Laredo'],
        'Utah': ['Salt Lake City', 'West Valley City', 'Provo', 'West Jordan', 'Orem', 'Sandy', 'Ogden', 'St. George', 'Layton', 'Taylorsville'],
        'Vermont': ['Burlington', 'Essex', 'South Burlington', 'Colchester', 'Rutland', 'Bennington', 'Brattleboro', 'Williston', 'Milton', 'Barre'],
        'Virginia': ['Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond', 'Newport News', 'Alexandria', 'Hampton', 'Roanoke', 'Portsmouth', 'Suffolk'],
        'Washington': ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue', 'Kent', 'Everett', 'Renton', 'Yakima', 'Federal Way'],
        'West Virginia': ['Charleston', 'Huntington', 'Parkersburg', 'Morgantown', 'Wheeling', 'Beckley', 'Fairmont', 'Clarksburg', 'Martinsburg', 'Weirton'],
        'Wisconsin': ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine', 'Appleton', 'Waukesha', 'Eau Claire', 'Oshkosh', 'Janesville'],
        'Wyoming': ['Cheyenne', 'Casper', 'Laramie', 'Gillette', 'Rock Springs', 'Sheridan', 'Green River', 'Evanston', 'Riverton', 'Jackson']
      }
    };
    return cityData[country]?.[state] || [];
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen overflow-y-auto">
      <div className="flex-1 hidden md:flex flex-col h-[100%] bg-[#F3FDFF]">
        <div className="flex-shrink-0 flex items-center gap-x-2 p-5">
          <img src={Logo} alt="" className="h-10" />
          <span className="text-xl">NGOC ANH</span>
        </div>
        <div className="flex-1 h-[90%]">
          <img src={AuthImage} alt="" className="h-[100%]" />
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center flex-col h-[100%] overflow-y-auto pt-[25rem] md:pt-0">
        <div className="w-full max-w-xl p-6">
          <h2 className="text-2xl mb-4">Create an account</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required type="text" name="firstName" placeholder="First Name" className="border p-2 rounded" onChange={handleChange} />
            <input required type="text" name="middleName" placeholder="Middle Name" className="border p-2 rounded" onChange={handleChange} />
            <input required type="text" name="lastName" placeholder="Last Name" className="border p-2 rounded" onChange={handleChange} />
            <input required type="email" name="email" placeholder="Email Address" className="border p-2 rounded" onChange={handleChange} />
            <input required type="password" name="password" placeholder="Password" className="border p-2 rounded" onChange={handleChange} />
            <input required type="password" name="confirmPassword" placeholder="Confirm Password" className="border p-2 rounded" />
            <input required type="tel" name="phone" placeholder="Phone Number" className="border p-2 rounded" onChange={handleChange} />
            <input required type="date" name="dob" placeholder="Date Of Birth" className="border p-2 rounded" onChange={handleChange} />
            <input required type="text" name="address" placeholder="Street Address" className="border p-2 rounded" onChange={handleChange} />
            <input type="text" name="otherAddressInfo" placeholder="Apt. #, Suite, Floor (Opt)" className="border p-2 rounded" onChange={handleChange} />

            <select required name="country" className="border p-2 rounded" onChange={handleChange} value={formData.country}>
              <option value="">Select Country</option>
              {['Vietnam', 'USA'].map((country) => (<option key={country} value={country}>{country}</option>))}
            </select>

            <select required name="state" className="border p-2 rounded" onChange={handleChange} value={formData.state} disabled={!formData.country}>
              <option value="">Select State</option>
              {states.map((state) => (<option key={state} value={state}>{state}</option>))}
            </select>

            <select required name="city" className="border p-2 rounded" onChange={handleChange} value={formData.city} disabled={!formData.state}>
              <option value="">Select City</option>
              {cities.map((city) => (<option key={city} value={city}>{city}</option>))}
            </select>

            <input required type="text" name="zipCode" placeholder="Zip Code" className="border p-2 rounded" onChange={handleChange} />
            <input type="text" name="refferalCode" placeholder="Referral Code (Optional)" className="border p-2 rounded" onChange={handleChange} />
          </form>
          <button className="w-full bg-[#9FE7F5] p-2 rounded mt-4" onClick={handleRegistration}>Sign Up</button>
          <p className="text-center mt-2 text-[#3D8977]">Already have an account? <Link to="/login" className="text-blue-500">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;