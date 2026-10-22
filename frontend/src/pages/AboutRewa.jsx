import React, { useState } from 'react';
import { Landmark, Compass, HelpCircle, Phone, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const CONTACTS = [
  { office: 'Collector Office', officer: 'Collector & District Magistrate', contact: '07662-255100', email: 'dmrewa@mp.gov.in' },
  { office: 'Municipal Corporation', officer: 'Municipal Commissioner', contact: '07662-254013', email: 'commrewa@mpenagarpalika.gov.in' },
  { office: 'Superintendent of Police', officer: 'SP Rewa Office', contact: '07662-252222', email: 'sp_rewa@mp.gov.in' },
];

const EMERGENCY = [
  { title: 'Police Emergency Response', number: '100 / 112' },
  { title: 'Ambulance Service', number: '108' },
  { title: 'Fire Services Command', number: '101' },
  { title: 'Women Helpline Desk', number: '1090' },
  { title: 'Child Protection Helpline', number: '1098' },
  { title: 'Electricity Board Emergency', number: '1912' },
  { title: 'Water Leakage Control', number: '07662-254015' },
];

const PLACES = [
  { name: 'Rewa Fort & Museum', desc: 'Historic palace reflecting Baghela architectural heritage housing weapons and artifacts.' },
  { name: 'Mukundpur White Tiger Safari', desc: 'World’s first white tiger sanctuary located in the near vicinity of Rewa.' },
  { name: 'Chachai & Purwa Waterfalls', desc: 'Breathtaking natural waterfall canyons located on the Beehar and Tons river paths.' },
  { name: 'Govindgarh Palace & Lake', desc: 'Summer home of the royal family situated adjacent to a pristine lake basin.' },
];

const FAQS = [
  { q: 'What is the "Auto Detect" category option in the complaint form?', a: 'When you select "Auto Detect", our backend utilizes natural language processing keyword filters to analyze your complaint description and automatically classify it into the correct category (e.g. Garbage, Roads & Potholes) and assign the responsible municipal department.' },
  { q: 'Can I report a complaint anonymously?', a: 'Yes, absolutely. By toggling "Submit Anonymously" on the complaint form, your personal citizen profile link is omitted from the public timeline. Note that anonymous complaints are not listed in your personal profile dashboard; you can track their status using the unique generated tracking ID.' },
  { q: 'How is the ward number determined automatically?', a: 'When you select the exact location on the Leaflet map or click "Use Current GPS", the system computes the distance to the nearest mapped Rewa locality and assigns the corresponding municipality ward number automatically.' },
  { q: 'Where do I find my municipal consumer number for utility bills?', a: 'Your consumer number is printed on the header of any previous physical bill issued by the Rewa Municipal Corporation. Water bills typically begin with "RWW", and property taxes begin with "RWP".' },
];

const AboutRewa = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-govBorder pb-5">
        <h1 className="text-2xl font-extrabold text-govTextPrimary">About Rewa City</h1>
        <p className="text-xs text-govTextSecondary mt-1">Discover history, development vision, key administrative contacts, and helpline directories</p>
      </div>

      {/* Grid: History and Vision */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* History & Vision */}
        <div className="md:col-span-8 space-y-6">
          <div className="bg-white border border-govBorder rounded-lg p-6 shadow-gov space-y-4">
            <h2 className="text-base font-extrabold text-govTextPrimary flex items-center space-x-2">
              <Landmark className="h-5 w-5 text-primary" />
              <span>Historical Legacy &amp; Overview</span>
            </h2>
            <p className="text-sm text-govTextSecondary leading-relaxed">
              Rewa is a major city in the northeastern region of Madhya Pradesh, India. It serves as the administrative headquarters of Rewa District and Rewa Division. Historically, Rewa was the capital of the princely state of Rewa and has a rich heritage of culture and valor. The region is globally famous as the birthplace of the first white tiger, Mohan, who was captured by Maharaja Martand Singh in 1951.
            </p>
            <p className="text-sm text-govTextSecondary leading-relaxed">
              The city is situated on the banks of the Beehar River, a tributary of the Tons River, and boasts architectural wonders like the Rewa Fort and Govindgarh Palace. Today, Rewa is transitioning rapidly into a smart urban center under the national development plans.
            </p>
          </div>

          <div className="bg-white border border-govBorder rounded-lg p-6 shadow-gov space-y-4">
            <h2 className="text-base font-extrabold text-govTextPrimary flex items-center space-x-2">
              <Compass className="h-5 w-5 text-primary" />
              <span>Smart City Rewa 2030 Vision</span>
            </h2>
            <p className="text-sm text-govTextSecondary leading-relaxed">
              Our vision for 2030 is to build a highly sustainable, transparent, and technology-driven infrastructure that elevates the quality of life for every citizen in Rewa. The objective is to automate civic grievance routing, ensure 100% waste collection efficiency, supply clean tap water to every household, and make public taxation procedures entirely digital and accessible.
            </p>
          </div>

          {/* Tourist Attractions */}
          <div className="bg-white border border-govBorder rounded-lg p-6 shadow-gov space-y-4">
            <h2 className="text-base font-extrabold text-govTextPrimary">Tourist Attractions &amp; Heritage Sites</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PLACES.map((p, i) => (
                <div key={i} className="bg-slate-50 border border-govBorder rounded-md p-3.5 space-y-1">
                  <h3 className="text-xs font-bold text-govTextPrimary">{p.name}</h3>
                  <p className="text-[11px] text-govTextSecondary leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contacts & Helplines Sidebar */}
        <div className="md:col-span-4 space-y-6">
          {/* Key Administration */}
          <div className="bg-white border border-govBorder rounded-lg p-5 shadow-gov space-y-4">
            <h2 className="text-sm font-bold text-govTextSecondary uppercase tracking-wider flex items-center">
              <FileText className="h-4 w-4 mr-1.5 text-primary" />
              <span>Administration Contacts</span>
            </h2>
            <div className="space-y-3.5 divide-y divide-slate-100">
              {CONTACTS.map((c, i) => (
                <div key={i} className={`text-xs ${i > 0 ? 'pt-3' : ''}`}>
                  <div className="font-bold text-govTextPrimary">{c.office}</div>
                  <div className="text-slate-500 mt-0.5">{c.officer}</div>
                  <div className="mt-1 text-primary font-medium">Ph: {c.contact}</div>
                  <div className="text-[10px] text-govTextSecondary">{c.email}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Helplines */}
          <div className="bg-white border border-govBorder rounded-lg p-5 shadow-gov space-y-4">
            <h2 className="text-sm font-bold text-govTextSecondary uppercase tracking-wider flex items-center">
              <Phone className="h-4 w-4 mr-1.5 text-rose-500 animate-pulse" />
              <span>Emergency Helpdesk</span>
            </h2>
            <div className="space-y-2.5">
              {EMERGENCY.map((e, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="text-govTextSecondary font-medium">{e.title}</span>
                  <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 border border-rose-100 rounded">
                    {e.number}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <section className="bg-white border border-govBorder rounded-lg p-6 shadow-gov space-y-4">
        <h2 className="text-base font-extrabold text-govTextPrimary flex items-center space-x-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          <span>Citizens FAQ Desk</span>
        </h2>
        
        <div className="space-y-3 divide-y divide-slate-100">
          {FAQS.map((faq, idx) => (
            <div key={idx} className={`pt-3 ${idx === 0 ? 'pt-0' : ''}`}>
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex justify-between items-center text-left text-sm font-bold text-govTextPrimary hover:text-primary transition-colors focus:outline-none"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
              </button>
              {openFaq === idx && (
                <p className="text-xs text-govTextSecondary leading-relaxed mt-2.5 bg-slate-50 p-3 rounded-md border border-govBorder">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutRewa;
