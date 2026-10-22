import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Complaint from '../models/Complaint.js';
import Announcement from '../models/Announcement.js';
import Scheme from '../models/Scheme.js';
import Bill from '../models/Bill.js';
import { REWA_LOCALITIES, CATEGORY_DEPARTMENT_MAP } from '../services/intelligenceService.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rewa-connect')
  .then(() => console.log('MongoDB Connected for Seeding...'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Realistic Visual Image Sets for Indian Civil Issues
const COMPLAINT_IMAGES = {
  'Roads & Potholes': [
    'https://upload.wikimedia.org/wikipedia/commons/e/ea/Broken_Roads_in_India%27s_Capital_New_Delhi.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/2/27/Big_fatal_hole_in_a_Delhi_road.jpg'
  ],
  'Street Light': [
    'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1548682637-293628dfb5a2?auto=format&fit=crop&w=600&q=80'
  ],
  'Garbage': [
    'https://upload.wikimedia.org/wikipedia/commons/9/9f/Garbage_heap_in_Batla_House%2C_New_Delhi%2C_18_June_2024.jpg',
    'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=600&q=80'
  ],
  'Water Supply': [
    'https://upload.wikimedia.org/wikipedia/commons/4/4f/Water_dripping_out_of_an_urban_water_supply_pipeline_in_India_20120311.jpg',
    'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80'
  ],
  'Drainage': [
    'https://images.unsplash.com/photo-1538356111088-7963d37604a1?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1605809791402-4ef859665bc7?auto=format&fit=crop&w=600&q=80'
  ],
  'Electricity': [
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80'
  ],
  'Park': [
    'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80'
  ],
  'Illegal Construction': [
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80'
  ],
  'Public Property': [
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80'
  ],
  'Other': [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'
  ]
};

const ANNOUNCEMENT_BANNERS = [
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80'
];

const COMPLAINT_DESCRIPTIONS = [
  {
    category: 'Roads & Potholes',
    desc: 'Extremely deep pothole near the main crossing. It has caused multiple two-wheeler accidents in the last two days. Needs immediate patching.',
  },
  {
    category: 'Street Light',
    desc: 'The entire stretch of streetlights is non-functional, leaving the street completely dark at night. Safety concern for women and elderly.',
  },
  {
    category: 'Garbage',
    desc: 'Solid waste is piling up on the roadside next to the park boundary. The sanitation truck has not visited this locality for four days.',
  },
  {
    category: 'Water Supply',
    desc: 'Drinking water supplied today is muddy and smells like sewage. Many households are reporting the same issue. Possible pipe leakage.',
  },
  {
    category: 'Drainage',
    desc: 'Drainage pipe is clogged and overflowing onto the main street. Foul-smelling water is logging the entrance of houses.',
  },
  {
    category: 'Electricity',
    desc: 'The electricity transformer in our locality is sparking constantly and making loud humming noises. Voltage levels are fluctuating widely.',
  },
  {
    category: 'Park',
    desc: 'The children playground benches are broken and wild bushes are overgrown, making it unsafe for kids to play here. Maintenance is required.',
  },
  {
    category: 'Illegal Construction',
    desc: 'Unauthorized commercial shop construction has started over the pavement/footpath, blocking pedestrian walking space completely.',
  },
  {
    category: 'Public Property',
    desc: 'The bus stop shelter seating benches have been broken by vandals and the roof is leaking during rain. Needs repairs.',
  },
];

const generateRandomCoordinates = (locality) => {
  // Add a small jitter (~100-200 meters) around the center coordinate of locality
  const jitterLat = (Math.random() - 0.5) * 0.004;
  const jitterLng = (Math.random() - 0.5) * 0.004;
  return {
    lat: Number((locality.lat + jitterLat).toFixed(6)),
    lng: Number((locality.lng + jitterLng).toFixed(6)),
  };
};

const runSeeder = async () => {
  try {
    // 1. Clear existing database
    console.log('Clearing database collection data...');
    await User.deleteMany({});
    await Complaint.deleteMany({});
    await Announcement.deleteMany({});
    await Scheme.deleteMany({});
    await Bill.deleteMany({});

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 3. Create Citizens
    console.log('Creating 15 Citizens...');
    const citizens = [];
    const citizenNames = [
      'Rajesh Patel', 'Sunita Sharma', 'Amit Mishra', 'Pooja Tiwari', 'Vikram Singh',
      'Anjali Gupta', 'Deepak Verma', 'Kiran Soni', 'Sanjay Dwivedi', 'Neha Baghel',
      'Ramesh Sen', 'Kavita Kushwaha', 'Vijay Kol', 'Jyoti Saket', 'Arvind Pandey'
    ];

    for (let i = 0; i < 15; i++) {
      const name = citizenNames[i];
      const nameKey = name.toLowerCase().replace(/\s+/g, '');
      citizens.push({
        name,
        mobile: `98765432${String(10 + i)}`,
        email: `${nameKey}@gmail.com`,
        password: hashedPassword,
        address: `${REWA_LOCALITIES[i % REWA_LOCALITIES.length].name}, Rewa, MP`,
        role: 'citizen',
        profilePhoto: `https://api.dicebear.com/7.x/adventurer/svg?seed=${nameKey}`,
      });
    }
    const createdCitizens = await User.insertMany(citizens);

    // 4. Create Officers
    console.log('Creating 5 Officers...');
    const officerDetails = [
      { name: 'Dr. Alok Vardhan', dept: 'PWD', email: 'alok.pwd@rewa.gov.in', mob: '8877665511' },
      { name: 'Er. S. K. Dwivedi', dept: 'Electrical Department', email: 'sk.electric@rewa.gov.in', mob: '8877665522' },
      { name: 'Shri R. P. Soni', dept: 'Municipal Sanitation', email: 'rp.sanitation@rewa.gov.in', mob: '8877665533' },
      { name: 'Er. Sandeep Tiwari', dept: 'Water Department', email: 'sandeep.water@rewa.gov.in', mob: '8877665544' },
      { name: 'Shri Manoj Pandey', dept: 'Building Authority', email: 'manoj.building@rewa.gov.in', mob: '8877665555' },
    ];

    const officers = [];
    for (const off of officerDetails) {
      officers.push({
        name: off.name,
        mobile: off.mob,
        email: off.email,
        password: hashedPassword,
        address: 'Municipal Corporation Headquarters, Civil Lines, Rewa',
        role: 'officer',
        department: off.dept,
        profilePhoto: `https://api.dicebear.com/7.x/initials/svg?seed=${off.name.replace(/\s+/g, '')}`,
      });
    }
    const createdOfficers = await User.insertMany(officers);

    // 5. Create Announcements
    console.log('Creating 30 Announcements...');
    const announcementCategories = [
      'Water Supply', 'Road Closure', 'Traffic', 'Emergency', 'Government Notice',
      'Public Notice', 'Development', 'Festival', 'Event'
    ];

    const announcements = [];
    for (let i = 1; i <= 30; i++) {
      const category = announcementCategories[i % announcementCategories.length];
      const pinned = i === 1 || i === 5 || i === 12; // Pinned items
      announcements.push({
        title: `Official Rewa Update: Notification #${i} - ${category}`,
        banner: ANNOUNCEMENT_BANNERS[i % ANNOUNCEMENT_BANNERS.length],
        description: `This is an important official notice regarding ${category.toLowerCase()} in Rewa City. The municipal administration requests all citizens to schedule their activities accordingly. Further details are available at the ward offices.`,
        category,
        pinned,
        publishedDate: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)), // staggered past days
      });
    }
    await Announcement.insertMany(announcements);

    // 6. Create Schemes
    console.log('Creating 20 Schemes...');
    const schemeCategories = ['Students', 'Farmers', 'Women', 'Business', 'Employment', 'Housing', 'Education'];
    const schemes = [];
    for (let i = 1; i <= 20; i++) {
      const category = schemeCategories[i % schemeCategories.length];
      schemes.push({
        name: `Rewa City Welfare Initiative Scheme - Plan #${i} for ${category}`,
        description: `Official Rewa Municipal Scheme designed to provide direct financial and infrastructural support to ${category.toLowerCase()} under the Smart City Rewa 2030 development goal.`,
        category,
        eligibility: `Residents of Rewa Municipal area belonging to ${category.toLowerCase()} category with annual household income less than ₹3,00,000.`,
        benefits: `Subsidy of up to 40% on municipal services, interest-free developmental loans up to ₹50,000, and free digital training workshops.`,
        requiredDocuments: ['Samagra ID', 'Aadhaar Card', 'Domicile Certificate', 'Income Certificate'],
        deadline: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), // 30 days in future
        applyLink: 'https://mpenagarpalika.gov.in',
      });
    }
    await Scheme.insertMany(schemes);

    // 7. Create Municipal Bills
    console.log('Creating 15 Bills...');
    const billTypes = ['Water Bill', 'Property Tax', 'Garbage Collection', 'Municipal Charges'];
    const bills = [];
    const consumerNames = ['Rajendra Singh', 'Pushpa Devi', 'Devraj Patel', 'Siddharth Mishra', 'Mamta Sen'];
    for (let i = 1; i <= 15; i++) {
      const billType = billTypes[i % billTypes.length];
      const consumerNumber = `RW${billType.charAt(0)}${1000000 + i}`;
      const status = i % 3 === 0 ? 'Paid' : 'Unpaid';
      const amount = 120 * i + 150;
      
      const paymentHistory = [];
      if (status === 'Paid') {
        paymentHistory.push({
          transactionId: `TXN-${Date.now()}-${200000 + i}`,
          amountPaid: amount,
          paidAt: new Date(Date.now() - (5 * 24 * 60 * 60 * 1000)),
          paymentMethod: 'UPI/Paytm',
        });
      }

      bills.push({
        billType,
        consumerNumber,
        amount,
        dueDate: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
        status,
        ownerName: consumerNames[i % consumerNames.length],
        paymentHistory,
      });
    }
    await Bill.insertMany(bills);

    // 8. Create Curated Complaints (12 specific issues with matched real images)
    console.log('Creating 12 Curated Complaints with Matched Images and Timelines...');
    
    const CURATED_COMPLAINTS = [
      {
        description: 'Extremely deep potholes near the main crossing at Sirmour Chowk. It has caused multiple two-wheeler accidents and traffic congestion.',
        category: 'Roads & Potholes',
        status: 'Pending',
        beforeImage: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Broken_Roads_in_India%27s_Capital_New_Delhi.jpg',
        afterImage: '',
        localityIndex: 0, // Sirmour Chowk
        isAnonymous: false
      },
      {
        description: 'Solid waste and garbage heap is piling up on the roadside near Shilpi Plaza market. The sanitation truck has not visited this locality for several days.',
        category: 'Garbage',
        status: 'Assigned',
        beforeImage: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Garbage_heap_in_Batla_House%2C_New_Delhi%2C_18_June_2024.jpg',
        afterImage: '',
        localityIndex: 1, // Shilpi Plaza
        isAnonymous: true
      },
      {
        description: 'Clean drinking water supplied by municipal pipes is leaking heavily from a cracked underground pipeline at Civil Lines.',
        category: 'Water Supply',
        status: 'In Progress',
        beforeImage: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Water_dripping_out_of_an_urban_water_supply_pipeline_in_India_20120311.jpg',
        afterImage: '',
        localityIndex: 4, // Civil Lines
        isAnonymous: false
      },
      {
        description: 'All the street light poles along College Chauraha road are completely non-functional, leaving the street pitch dark and unsafe at night.',
        category: 'Street Light',
        status: 'Resolved',
        beforeImage: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=600&q=80',
        afterImage: 'https://images.unsplash.com/photo-1548682637-293628dfb5a2?auto=format&fit=crop&w=600&q=80',
        localityIndex: 9, // College Chauraha
        isAnonymous: false
      },
      {
        description: 'Sewerage drainage pipe is clogged and overflowing black water onto the main street at Amahiya, causing foul smell.',
        category: 'Drainage',
        status: 'Resolved',
        beforeImage: 'https://images.unsplash.com/photo-1538356111088-7963d37604a1?auto=format&fit=crop&w=600&q=80',
        afterImage: 'https://images.unsplash.com/photo-1605809791402-4ef859665bc7?auto=format&fit=crop&w=600&q=80',
        localityIndex: 3, // Amahiya
        isAnonymous: true
      },
      {
        description: 'The overhead electricity transformer near Saman is constantly sparking during load hours, creating a serious fire hazard.',
        category: 'Electricity',
        status: 'Accepted',
        beforeImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80',
        afterImage: '',
        localityIndex: 2, // Saman
        isAnonymous: false
      },
      {
        description: 'The local children park at Khutehi has broken swings, rusted slides, and overgrown wild weeds, making it unusable.',
        category: 'Park',
        status: 'Resolved',
        beforeImage: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=600&q=80',
        afterImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
        localityIndex: 5, // Khutehi
        isAnonymous: false
      },
      {
        description: 'An illegal commercial structure is being constructed directly on top of the public footpath near Rathara, blocking pedestrians.',
        category: 'Illegal Construction',
        status: 'Rejected',
        beforeImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80',
        afterImage: '',
        localityIndex: 8, // Rathara
        isAnonymous: false
      },
      {
        description: 'The public bus shelter seating benches at Bodabag have been completely broken and the roof metal sheet is damaged.',
        category: 'Public Property',
        status: 'Reopened',
        beforeImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80',
        afterImage: '',
        localityIndex: 7, // Bodabag
        isAnonymous: true
      },
      {
        description: 'Large pothole on the pedestrian pavement walk near Padra Chowk is causing injuries to pedestrians at night.',
        category: 'Roads & Potholes',
        status: 'Resolved',
        beforeImage: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Big_fatal_hole_in_a_Delhi_road.jpg',
        afterImage: 'https://images.unsplash.com/photo-1621221821087-34253b878b26?auto=format&fit=crop&w=600&q=80',
        localityIndex: 6, // Padra
        isAnonymous: false
      },
      {
        description: 'Sanitation truck has not cleared the garbage bin near College Chauraha corner, leading to stray dog menace.',
        category: 'Garbage',
        status: 'Pending',
        beforeImage: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Garbage_heap_in_Batla_House%2C_New_Delhi%2C_18_June_2024.jpg',
        afterImage: '',
        localityIndex: 9, // College Chauraha
        isAnonymous: false
      },
      {
        description: 'Low hanging live electricity cables from the main utility post at Amahiya are touching high vehicles passing by.',
        category: 'Electricity',
        status: 'In Progress',
        beforeImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80',
        afterImage: '',
        localityIndex: 3, // Amahiya
        isAnonymous: false
      }
    ];

    const complaints = [];

    for (let i = 0; i < CURATED_COMPLAINTS.length; i++) {
      const template = CURATED_COMPLAINTS[i];
      const localityObj = REWA_LOCALITIES[template.localityIndex];
      const coords = generateRandomCoordinates(localityObj);
      const reporter = template.isAnonymous ? null : createdCitizens[i % createdCitizens.length]._id;
      const status = template.status;

      const dept = CATEGORY_DEPARTMENT_MAP[template.category] || 'General Administration';
      const associatedOfficer = createdOfficers.find(o => o.department === dept) || createdOfficers[0];

      // Build realistic timelines based on status
      const timeline = [];
      const submitTime = new Date(Date.now() - (10 * 24 * 60 * 60 * 1000) + (i * 8 * 60 * 60 * 1000));
      
      // 1. Submitted
      timeline.push({
        status: 'Pending',
        remarks: 'Complaint successfully filed by citizen with visual evidence.',
        images: [template.beforeImage],
        timestamp: submitTime,
      });

      // 2. Assigned
      if (status !== 'Pending') {
        const assignTime = new Date(submitTime.getTime() + (6 * 60 * 60 * 1000));
        timeline.push({
          status: 'Assigned',
          officer: associatedOfficer._id,
          remarks: `Complaint routed to ${dept} department. Assigned officer: ${associatedOfficer.name}.`,
          images: [],
          timestamp: assignTime,
        });
      }

      // 3. Accepted & In Progress
      if (['Accepted', 'In Progress', 'Resolved'].includes(status)) {
        const acceptTime = new Date(submitTime.getTime() + (24 * 60 * 60 * 1000));
        timeline.push({
          status: 'Accepted',
          officer: associatedOfficer._id,
          remarks: `Officer ${associatedOfficer.name} has accepted the case and scheduled a field inspection.`,
          images: [],
          timestamp: acceptTime,
        });

        if (['In Progress', 'Resolved'].includes(status)) {
          const progressTime = new Date(acceptTime.getTime() + (12 * 60 * 60 * 1000));
          timeline.push({
            status: 'In Progress',
            officer: associatedOfficer._id,
            remarks: 'Repair work initiated at the site location. Field laborers deployed.',
            images: [],
            timestamp: progressTime,
          });
        }
      }

      // 4. Resolved
      if (status === 'Resolved') {
        const resolveTime = new Date(submitTime.getTime() + (3 * 24 * 60 * 60 * 1000));
        timeline.push({
          status: 'Resolved',
          officer: associatedOfficer._id,
          remarks: 'The reported grievance has been successfully resolved. Repairs verified and site cleaned up.',
          images: [template.afterImage],
          timestamp: resolveTime,
        });
      }

      // 5. Rejected
      if (status === 'Rejected') {
        const rejectTime = new Date(submitTime.getTime() + (8 * 60 * 60 * 1000));
        timeline.push({
          status: 'Rejected',
          officer: associatedOfficer._id,
          remarks: 'Complaint rejected. The reported coordinates fall on a private construction layout, outside municipal public property boundaries.',
          images: [],
          timestamp: rejectTime,
        });
      }

      // 6. Reopened
      if (status === 'Reopened') {
        const resolveTime = new Date(submitTime.getTime() + (2 * 24 * 60 * 60 * 1000));
        timeline.push({
          status: 'Resolved',
          officer: associatedOfficer._id,
          remarks: 'Initial repairs completed by municipal department field crew.',
          images: [template.beforeImage],
          timestamp: resolveTime,
        });

        const reopenTime = new Date(resolveTime.getTime() + (24 * 60 * 60 * 1000));
        timeline.push({
          status: 'Reopened',
          remarks: 'Citizen reopened the complaint. The temporary fix was washed away by rain; permanent concrete layer requested.',
          images: [],
          timestamp: reopenTime,
        });
      }

      // Padded digits for complaintId
      const complSeq = String(i + 1).padStart(6, '0');
      const complaintId = `RW-2026-${complSeq}`;

      complaints.push({
        complaintId,
        description: template.description,
        images: [template.beforeImage],
        category: template.category,
        status,
        location: coords,
        locality: localityObj.name,
        ward: localityObj.ward,
        department: dept,
        reporter,
        isAnonymous: template.isAnonymous,
        timeline,
        createdAt: submitTime,
        updatedAt: timeline[timeline.length - 1].timestamp,
      });
    }

    await Complaint.insertMany(complaints);
    console.log(`Seeded database successfully with ${complaints.length} curated complaints, 30 announcements, 20 schemes, 15 citizens, 5 officers, and 15 bills!`);
    mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding process failed:', err);
    mongoose.disconnect();
    process.exit(1);
  }
};

runSeeder();
