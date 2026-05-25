import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

async function seedDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection(DATABASE_URL);
    
    console.log('🌱 Starting database seed...');

    // Clear existing data (optional - comment out to preserve data)
    // await connection.execute('DELETE FROM projectPricing');
    // await connection.execute('DELETE FROM projectAmenities');
    // await connection.execute('DELETE FROM projectImages');
    // await connection.execute('DELETE FROM projects');
    // await connection.execute('DELETE FROM investors');
    // await connection.execute('DELETE FROM wards');

    // ============ INSERT WARDS ============
    console.log('📍 Seeding wards...');
    
    const wardsData = [
      { name: 'Phường Hải Châu', district: 'Quận Hải Châu', latitude: '16.0678', longitude: '108.2212' },
      { name: 'Phường Thanh Bình', district: 'Quận Hải Châu', latitude: '16.0745', longitude: '108.2145' },
      { name: 'Phường Bình Hiên', district: 'Quận Hải Châu', latitude: '16.0612', longitude: '108.2278' },
      { name: 'Phường Cẩm Lệ', district: 'Quận Cẩm Lệ', latitude: '16.0512', longitude: '108.2512' },
      { name: 'Phường Mỹ An', district: 'Quận Ngũ Hành Sơn', latitude: '16.0145', longitude: '108.2678' },
      { name: 'Phường Khuê Mỹ', district: 'Quận Ngũ Hành Sơn', latitude: '16.0078', longitude: '108.2745' },
      { name: 'Phường Hòa Minh', district: 'Quận Liên Chiểu', latitude: '16.0945', longitude: '108.1945' },
      { name: 'Phường Hòa Khánh', district: 'Quận Liên Chiểu', latitude: '16.1012', longitude: '108.1878' },
    ];

    let wardIds = {};
    for (const ward of wardsData) {
      const [result] = await connection.execute(
        'INSERT INTO wards (name, district, latitude, longitude) VALUES (?, ?, ?, ?)',
        [ward.name, ward.district, ward.latitude, ward.longitude]
      );
      wardIds[ward.name] = result.insertId;
      console.log(`  ✓ ${ward.name}`);
    }

    // ============ INSERT INVESTORS ============
    console.log('🏢 Seeding investors...');
    
    const investorsData = [
      { name: 'Công ty Cổ phần Phát triển Nhà Đà Nẵng', phone: '0236.3822.222', email: 'info@dananghousing.vn', website: 'www.dananghousing.vn' },
      { name: 'Tập đoàn Xây dựng Hòa Bình', phone: '0236.3888.888', email: 'contact@hoabinhgroup.vn', website: 'www.hoabinhgroup.vn' },
      { name: 'Công ty Cổ phần Bất động sản Sơn Trà', phone: '0236.3777.777', email: 'sales@sontra.vn', website: 'www.sontra.vn' },
      { name: 'Tập đoàn Viglacera', phone: '0236.3666.666', email: 'danang@viglacera.com.vn', website: 'www.viglacera.com.vn' },
      { name: 'Công ty Cổ phần Phát triển Bất động sản Đông Á', phone: '0236.3555.555', email: 'info@dongabds.vn', website: 'www.dongabds.vn' },
    ];

    let investorIds = {};
    for (const investor of investorsData) {
      const [result] = await connection.execute(
        'INSERT INTO investors (name, phone, email, website) VALUES (?, ?, ?, ?)',
        [investor.name, investor.phone, investor.email, investor.website]
      );
      investorIds[investor.name] = result.insertId;
      console.log(`  ✓ ${investor.name}`);
    }

    // ============ INSERT PROJECTS ============
    console.log('🏗️  Seeding projects...');
    
    const projectsData = [
      {
        name: 'Khu nhà ở xã hội Hải Châu',
        description: 'Dự án nhà ở xã hội quy mô lớn tại khu vực Hải Châu, gồm 500 căn hộ với diện tích từ 45-75m²',
        address: '123 Đường Hùng Vương, Phường Hải Châu, Quận Hải Châu',
        wardId: wardIds['Phường Hải Châu'],
        investorId: investorIds['Công ty Cổ phần Phát triển Nhà Đà Nẵng'],
        latitude: '16.0678',
        longitude: '108.2212',
        totalUnits: 500,
        soldUnits: 320,
        unitArea: '45-75m²',
        pricePerM2: '15,000,000 - 20,000,000 VNĐ/m²',
        status: 'under_construction',
        progress: 65,
        completionDate: 'Q4 2025',
        projectType: 'apartment',
      },
      {
        name: 'Khu nhà ở xã hội Thanh Bình',
        description: 'Dự án nhà ở xã hội hiện đại với 300 căn hộ, tiện ích đầy đủ, gần trường học và bệnh viện',
        address: '456 Đường Trần Phú, Phường Thanh Bình, Quận Hải Châu',
        wardId: wardIds['Phường Thanh Bình'],
        investorId: investorIds['Tập đoàn Xây dựng Hòa Bình'],
        latitude: '16.0745',
        longitude: '108.2145',
        totalUnits: 300,
        soldUnits: 150,
        unitArea: '50-80m²',
        pricePerM2: '16,000,000 - 21,000,000 VNĐ/m²',
        status: 'opening_sale',
        progress: 40,
        completionDate: 'Q2 2026',
        projectType: 'apartment',
      },
      {
        name: 'Khu nhà ở xã hội Bình Hiên',
        description: 'Dự án nhà ở xã hội với 200 căn hộ, thiết kế hiện đại, an ninh 24/7',
        address: '789 Đường Lê Duẩn, Phường Bình Hiên, Quận Hải Châu',
        wardId: wardIds['Phường Bình Hiên'],
        investorId: investorIds['Công ty Cổ phần Bất động sản Sơn Trà'],
        latitude: '16.0612',
        longitude: '108.2278',
        totalUnits: 200,
        soldUnits: 200,
        unitArea: '55-85m²',
        pricePerM2: '17,000,000 - 22,000,000 VNĐ/m²',
        status: 'handed_over',
        progress: 100,
        completionDate: 'Q1 2024',
        projectType: 'apartment',
      },
      {
        name: 'Khu nhà ở xã hội Cẩm Lệ',
        description: 'Dự án nhà ở xã hội quy mô 400 căn hộ, gần trung tâm thành phố, giao thông thuận tiện',
        address: '321 Đường Nguyễn Văn Linh, Phường Cẩm Lệ, Quận Cẩm Lệ',
        wardId: wardIds['Phường Cẩm Lệ'],
        investorId: investorIds['Tập đoàn Viglacera'],
        latitude: '16.0512',
        longitude: '108.2512',
        totalUnits: 400,
        soldUnits: 0,
        unitArea: '48-78m²',
        pricePerM2: '14,000,000 - 19,000,000 VNĐ/m²',
        status: 'coming_soon',
        progress: 0,
        completionDate: 'Q3 2026',
        projectType: 'apartment',
      },
      {
        name: 'Khu nhà ở xã hội Mỹ An',
        description: 'Dự án nhà ở xã hội 350 căn hộ tại Mỹ An, view biển, tiện ích đầy đủ',
        address: '654 Đường Hồ Nghinh, Phường Mỹ An, Quận Ngũ Hành Sơn',
        wardId: wardIds['Phường Mỹ An'],
        investorId: investorIds['Công ty Cổ phần Phát triển Bất động sản Đông Á'],
        latitude: '16.0145',
        longitude: '108.2678',
        totalUnits: 350,
        soldUnits: 280,
        unitArea: '52-82m²',
        pricePerM2: '18,000,000 - 23,000,000 VNĐ/m²',
        status: 'under_construction',
        progress: 75,
        completionDate: 'Q1 2026',
        projectType: 'apartment',
      },
      {
        name: 'Khu nhà ở xã hội Khuê Mỹ',
        description: 'Dự án nhà ở xã hội 250 căn hộ, kiến trúc hiện đại, cộng đồng xanh',
        address: '987 Đường Võ Nguyên Giáp, Phường Khuê Mỹ, Quận Ngũ Hành Sơn',
        wardId: wardIds['Phường Khuê Mỹ'],
        investorId: investorIds['Công ty Cổ phần Phát triển Nhà Đà Nẵng'],
        latitude: '16.0078',
        longitude: '108.2745',
        totalUnits: 250,
        soldUnits: 250,
        unitArea: '58-88m²',
        pricePerM2: '19,000,000 - 24,000,000 VNĐ/m²',
        status: 'completed',
        progress: 100,
        completionDate: 'Q4 2023',
        projectType: 'apartment',
      },
      {
        name: 'Khu nhà ở xã hội Hòa Minh',
        description: 'Dự án nhà ở xã hội 280 căn hộ, gần chợ, trường học, bệnh viện',
        address: '111 Đường Tôn Đức Thắng, Phường Hòa Minh, Quận Liên Chiểu',
        wardId: wardIds['Phường Hòa Minh'],
        investorId: investorIds['Tập đoàn Xây dựng Hòa Bình'],
        latitude: '16.0945',
        longitude: '108.1945',
        totalUnits: 280,
        soldUnits: 180,
        unitArea: '50-80m²',
        pricePerM2: '15,000,000 - 20,000,000 VNĐ/m²',
        status: 'opening_sale',
        progress: 50,
        completionDate: 'Q3 2025',
        projectType: 'apartment',
      },
      {
        name: 'Khu nhà ở xã hội Hòa Khánh',
        description: 'Dự án nhà ở xã hội 320 căn hộ, thiết kế thông minh, tiết kiệm năng lượng',
        address: '222 Đường Hoàng Diệu, Phường Hòa Khánh, Quận Liên Chiểu',
        wardId: wardIds['Phường Hòa Khánh'],
        investorId: investorIds['Công ty Cổ phần Bất động sản Sơn Trà'],
        latitude: '16.1012',
        longitude: '108.1878',
        totalUnits: 320,
        soldUnits: 100,
        unitArea: '48-78m²',
        pricePerM2: '14,000,000 - 19,000,000 VNĐ/m²',
        status: 'under_construction',
        progress: 35,
        completionDate: 'Q4 2025',
        projectType: 'apartment',
      },
    ];

    let projectIds = {};
    for (const project of projectsData) {
      const [result] = await connection.execute(
        `INSERT INTO projects (name, description, address, wardId, investorId, latitude, longitude, totalUnits, soldUnits, unitArea, pricePerM2, status, progress, completionDate, projectType) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          project.name, project.description, project.address, project.wardId, project.investorId,
          project.latitude, project.longitude, project.totalUnits, project.soldUnits, project.unitArea,
          project.pricePerM2, project.status, project.progress, project.completionDate, project.projectType
        ]
      );
      projectIds[project.name] = result.insertId;
      console.log(`  ✓ ${project.name}`);
    }

    // ============ INSERT PROJECT IMAGES ============
    console.log('🖼️  Seeding project images...');
    
    const imageData = [
      { projectName: 'Khu nhà ở xã hội Hải Châu', caption: 'Hình ảnh tổng thể dự án', order: 1 },
      { projectName: 'Khu nhà ở xã hội Hải Châu', caption: 'Khu vực tiện ích chung', order: 2 },
      { projectName: 'Khu nhà ở xã hội Thanh Bình', caption: 'Hình ảnh tổng thể dự án', order: 1 },
      { projectName: 'Khu nhà ở xã hội Bình Hiên', caption: 'Hình ảnh tổng thể dự án', order: 1 },
      { projectName: 'Khu nhà ở xã hội Mỹ An', caption: 'View biển từ dự án', order: 1 },
    ];

    for (const img of imageData) {
      const projectId = projectIds[img.projectName];
      if (projectId) {
        await connection.execute(
          'INSERT INTO projectImages (projectId, imageUrl, caption, `order`) VALUES (?, ?, ?, ?)',
          [projectId, `https://via.placeholder.com/600x400?text=${encodeURIComponent(img.caption)}`, img.caption, img.order]
        );
        console.log(`  ✓ ${img.projectName} - ${img.caption}`);
      }
    }

    // ============ INSERT PROJECT AMENITIES ============
    console.log('🏪 Seeding project amenities...');
    
    const amenitiesData = [
      { projectName: 'Khu nhà ở xã hội Hải Châu', type: 'school', name: 'Trường Tiểu học Hải Châu', distance: '500m' },
      { projectName: 'Khu nhà ở xã hội Hải Châu', type: 'hospital', name: 'Bệnh viện Đà Nẵng', distance: '1km' },
      { projectName: 'Khu nhà ở xã hội Hải Châu', type: 'market', name: 'Chợ Hải Châu', distance: '300m' },
      { projectName: 'Khu nhà ở xã hội Thanh Bình', type: 'school', name: 'Trường THCS Thanh Bình', distance: '400m' },
      { projectName: 'Khu nhà ở xã hội Thanh Bình', type: 'shopping', name: 'Siêu thị Big C', distance: '800m' },
      { projectName: 'Khu nhà ở xã hội Mỹ An', type: 'park', name: 'Công viên Mỹ An', distance: '200m' },
      { projectName: 'Khu nhà ở xã hội Mỹ An', type: 'transport', name: 'Bến xe Mỹ An', distance: '600m' },
    ];

    for (const amenity of amenitiesData) {
      const projectId = projectIds[amenity.projectName];
      if (projectId) {
        await connection.execute(
          'INSERT INTO projectAmenities (projectId, type, name, distance) VALUES (?, ?, ?, ?)',
          [projectId, amenity.type, amenity.name, amenity.distance]
        );
        console.log(`  ✓ ${amenity.projectName} - ${amenity.name}`);
      }
    }

    // ============ INSERT PROJECT PRICING ============
    console.log('💰 Seeding project pricing...');
    
    const pricingData = [
      { projectName: 'Khu nhà ở xã hội Hải Châu', unitType: 'Studio', area: '45m²', price: '675,000,000 VNĐ' },
      { projectName: 'Khu nhà ở xã hội Hải Châu', unitType: '1 Phòng ngủ', area: '55m²', price: '825,000,000 VNĐ' },
      { projectName: 'Khu nhà ở xã hội Hải Châu', unitType: '2 Phòng ngủ', area: '75m²', price: '1,125,000,000 VNĐ' },
      { projectName: 'Khu nhà ở xã hội Thanh Bình', unitType: 'Studio', area: '50m²', price: '800,000,000 VNĐ' },
      { projectName: 'Khu nhà ở xã hội Thanh Bình', unitType: '1 Phòng ngủ', area: '65m²', price: '1,040,000,000 VNĐ' },
      { projectName: 'Khu nhà ở xã hội Bình Hiên', unitType: '1 Phòng ngủ', area: '55m²', price: '935,000,000 VNĐ' },
      { projectName: 'Khu nhà ở xã hội Bình Hiên', unitType: '2 Phòng ngủ', area: '85m²', price: '1,445,000,000 VNĐ' },
      { projectName: 'Khu nhà ở xã hội Mỹ An', unitType: '1 Phòng ngủ', area: '52m²', price: '936,000,000 VNĐ' },
      { projectName: 'Khu nhà ở xã hội Mỹ An', unitType: '2 Phòng ngủ', area: '82m²', price: '1,476,000,000 VNĐ' },
    ];

    for (const pricing of pricingData) {
      const projectId = projectIds[pricing.projectName];
      if (projectId) {
        await connection.execute(
          'INSERT INTO projectPricing (projectId, unitType, area, price) VALUES (?, ?, ?, ?)',
          [projectId, pricing.unitType, pricing.area, pricing.price]
        );
        console.log(`  ✓ ${pricing.projectName} - ${pricing.unitType}`);
      }
    }

    console.log('\n✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedDatabase();
