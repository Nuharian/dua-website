import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Admin from '../src/models/Admin';
import Settings from '../src/models/Settings';
import TeamMember from '../src/models/TeamMember';
import Advisor from '../src/models/Advisor';
import Partner from '../src/models/Partner';
import Initiative from '../src/models/Initiative';
import ImpactStat from '../src/models/ImpactStat';
import DonationOption from '../src/models/DonationOption';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connected!');

        console.log('Clearing existing data...');
        await Promise.all([
            Admin.deleteMany({}),
            Settings.deleteMany({}),
            TeamMember.deleteMany({}),
            Advisor.deleteMany({}),
            Partner.deleteMany({}),
            Initiative.deleteMany({}),
            ImpactStat.deleteMany({}),
            DonationOption.deleteMany({}),
        ]);
        console.log('Data cleared.');

        console.log('Seeding Admin...');
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
        await Admin.create({
            email: process.env.ADMIN_EMAIL || 'admin@duabd.org',
            password: hashedPassword,
            name: 'Super Admin',
            role: 'super_admin',
        });

        console.log('Seeding Settings...');
        await Settings.create({
            siteName: 'Development and Unity Alliance',
            tagline: 'Delivering Happiness',
            motto: 'Delivering Happiness, Through healthcare, education, and communal welfare initiatives across rural Bangladesh.',
            aboutIntro: 'Development and Unity Alliance is a non-profit organisation dedicated to delivering happiness and improving lives through comprehensive Healthcare, quality Education, and sustainable Communal welfare programs across Bangladesh.',
            welcomeMessage: `We welcome you to Development and Unity Alliance (DUA), an organization that has been founded on the values of compassion, dignity, and empowerment. We are a community-driven and nonprofit initiative that envisions a brighter future for all, especially for the underserved communities of Bangladesh.
We work in various fields ranging from healthcare and education to climate action and inclusivity. Our mission is simple yet profound: to deliver happiness where it’s needed most.`,
            mission: `"Where Compassion Meets Action"
To provide comprehensive healthcare, quality education, and social welfare services that uplift communities and deliver happiness to those in need.`,
            vision: `"A Hopeful Future"
To build a society where every individual has access to quality healthcare, education, and communal support, creating sustainable communities that thrive with dignity and hope.`,
            address: '25/13C, Tajmahal Road, Mohammapur, Dhaka-1207, Bangladesh',
            email: 'Info@duabd.org',
            phone: '+8801743121942',
            website: 'www.duabd.org',
            socialLinks: {
                facebook: '',
                instagram: '',
                youtube: '',
                tiktok: '',
                linkedin: '',
            },
            animations: {
                heroAnimation: 'kenburns',
                sectionAnimation: 'fadeUp',
                hoverEffect: 'glow',
                enableParallax: true,
                enableSmoothScroll: true,
            },
        });

        console.log('Seeding Team Members...');
        const teamMembers = [
            { name: 'Md Shofikul Islam', role: 'Founder', organization: 'BRAC University', email: 'mdshofikulislam042@gmail.com', type: 'founder', order: 1 },
            { name: 'Farhin Ahmed', role: 'Co-Founder', organization: 'University of Melbourne', email: 'farhinahmed13@gmail.com', type: 'co_founder', order: 2 },
            { name: 'Arian Nuhan', role: 'Co-Founder', organization: 'BRAC University', email: 'ariannuhan41@gmail.com', type: 'co_founder', order: 3 },
            { name: 'Rubayat Ecolo', role: 'General Member', organization: 'AUST University', type: 'member', order: 4 },
            { name: 'Fahmidul Alam', role: 'General Member', organization: 'BRAC University', type: 'member', order: 5 },
            { name: 'Maisun Shikder Maisha', role: 'General Member', organization: 'University of Sydney', type: 'member', order: 6 },
            { name: 'Noor E Jannat', role: 'General Member', organization: 'BRAC University', type: 'member', order: 7 },
            { name: 'Abdullah Al Limon', role: 'General Member', organization: 'Stamford University Bangladesh', type: 'member', order: 8 },
        ];
        await TeamMember.insertMany(teamMembers);

        console.log('Seeding Advisors...');
        const advisors = [
            { name: 'Dr. Monir Hossain', title: 'MBBS', credentials: 'Assistant Professor', organization: 'Shahabuddin Medical College and Hospital', order: 1 },
            { name: 'Mohammad Rafiqul Islam', title: 'PhD', credentials: 'Assistant Professor', organization: 'BRAC Institute of Languages, BRAC University', order: 2 },
            { name: 'Mohammad Mynuddin', title: 'Associate Professor', credentials: '', organization: 'Dhaka Residential Model College', order: 3 },
        ];
        await Advisor.insertMany(advisors);

        console.log('Seeding Partners...');
        const partners = [
            { name: 'Insaf Barakah Foundation', location: 'Dhaka, Bangladesh', order: 1 },
            { name: 'Insaf Barakah Kidney and General Hospital', location: 'Dhaka', order: 2 },
            { name: 'Shahbuddin Medical College and Hospital', location: 'Dhaka', order: 3 },
            { name: 'Hi-Care General Hospital', location: 'Uttara, Dhaka-1230', order: 4 },
            { name: 'English Learning Abode', location: '', order: 5 },
        ];
        await Partner.insertMany(partners);

        console.log('Seeding Initiatives...');
        const initiatives = [
            { title: 'DUA Healthcamp', slug: 'dua-healthcamp', description: 'Free health camps providing medical care to underserved communities', category: 'healthcare', status: 'ongoing', isHighlighted: true, order: 1 },
            { title: 'Climate First by DUA', slug: 'climate-first', description: 'Environmental initiatives for climate action', category: 'environment', status: 'ongoing', isHighlighted: true, order: 2 },
            { title: 'Korail Diaries', slug: 'korail-diaries', description: 'Community support program in Korail', category: 'welfare', status: 'ongoing', isHighlighted: true, order: 3 },
            { title: 'Mental Health Initiative with InsideGlobal', slug: 'mental-health-initiative', description: 'Mental health awareness and support program', category: 'healthcare', status: 'ongoing', order: 4 },
            { title: 'Happy Box for Saint Martin', slug: 'happy-box-saint-martin', description: 'Happiness delivery program for Saint Martin communities', category: 'welfare', status: 'ongoing', order: 5 },
            { title: 'Barakah: The Ramadan & Eid Initiative', slug: 'barakah-ramadan-eid', description: 'Special programs during Ramadan and Eid celebrations', category: 'welfare', status: 'ongoing', order: 6 },
            { title: 'Seba Tori (Boat Hospital)', slug: 'seba-tori', description: 'Mobile healthcare via boat for remote areas', category: 'healthcare', status: 'ongoing', isHighlighted: true, order: 7 },
            { title: 'Second Chance Stationery', slug: 'second-chance-stationery', description: 'Recycled stationery initiative for education', category: 'education', status: 'ongoing', order: 8 },
            { title: 'Amr Chokhe Korail', slug: 'amr-chokhe-korail', description: 'Community documentation project in Korail', category: 'welfare', status: 'ongoing', order: 9 },
            { title: 'DUA Healthcare Centre', slug: 'dua-healthcare-centre', description: 'A humanitarian initiative founded on the belief that access to healthcare is a fundamental human right. Establishing a standard, compassionate hospital for free and quality medical care.', category: 'healthcare', status: 'upcoming', isHighlighted: true, order: 10 },
        ];
        await Initiative.insertMany(initiatives);

        console.log('Seeding Impact Stats...');
        const impactStats = [
            { label: 'Health Camps Conducted', value: '27+', description: '15000+ health beneficiaries', icon: 'health', order: 1 },
            { label: 'Meals Served', value: '7000+', description: 'Nutritious meals for communities', icon: 'food', order: 2 },
            { label: 'Families Helped', value: '5200+', description: 'Emergency relief support', icon: 'family', order: 3 },
            { label: 'Trees Planted', value: '1500+', description: 'Environmental conservation', icon: 'tree', order: 4 },
            { label: 'Children Educated', value: '300+', description: '30+ orphans with full DUA support', icon: 'education', order: 5 },
        ];
        await ImpactStat.insertMany(impactStats);

        console.log('Seeding Donation Options...');
        const donationOptions = [
            { type: 'bkash', name: 'bKash', accountNumber: '01XXXXXXXXX', instructions: 'Send money to our bKash number', order: 1 },
            { type: 'nagad', name: 'Nagad', accountNumber: '01XXXXXXXXX', instructions: 'Send money to our Nagad number', order: 2 },
            { type: 'rocket', name: 'Rocket', accountNumber: '01XXXXXXXXX', instructions: 'Send money to our Rocket number', order: 3 },
            { type: 'bank', name: 'Bank Transfer', accountNumber: 'Account Number', bankName: 'Bank Name', branchName: 'Branch Name', instructions: 'Transfer to our bank account', order: 4 },
        ];
        await DonationOption.insertMany(donationOptions);

        console.log('Database seeded successfully!');
        process.exit(0);

    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
}

seed();
