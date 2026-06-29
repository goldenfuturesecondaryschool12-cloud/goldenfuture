import { motion } from 'framer-motion';
import { Vote, Trophy, Users, Crown, Shield, Star, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import PageHeader from '../../components/ui/PageHeader';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import type { ElectionCandidate } from '../../types';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const houseColors = {
  Red: { bg: 'bg-red-500', light: 'bg-red-100 text-red-700 border-red-200' },
  Blue: { bg: 'bg-blue-500', light: 'bg-blue-100 text-blue-700 border-blue-200' },
  Green: { bg: 'bg-green-500', light: 'bg-green-100 text-green-700 border-green-200' },
  Yellow: { bg: 'bg-yellow-400', light: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
};

const allPositions = [
  'Head Boy',
  'Head Girl',
  'Games Captain (Boys)',
  'Games Captain (Girls)',
  'Red House Captain',
  'Blue House Captain',
  'Green House Captain',
  'Yellow House Captain',
  'Red House Vice Captain',
  'Blue House Vice Captain',
  'Green House Vice Captain',
  'Yellow House Vice Captain',
];

const electionProcess = [
  { step: 1, title: 'Nomination', desc: 'Students meeting eligibility criteria submit their nomination forms to the election committee.', icon: Users },
  { step: 2, title: 'Campaign', desc: 'Nominated candidates present their manifesto and campaign to fellow students respectfully.', icon: Vote },
  { step: 3, title: 'Voting', desc: 'All students from Class 4 and above cast their secret ballots on election day.', icon: CheckCircle },
  { step: 4, title: 'Results', desc: 'Votes are counted transparently and results are announced officially by the Principal.', icon: Trophy },
];

const eligibilityCriteria = [
  'Must be studying in Class 7 or above',
  'Must have a minimum attendance of 85%',
  'Must not have any disciplinary record',
  'Must have secured at least Grade C+ in all subjects',
  'Must have the recommendation of the class teacher',
  'Must submit a signed parental consent form',
];

function CandidateCard({ candidate }: { candidate: Partial<ElectionCandidate> & { name: string; position: string } }) {
  const houseConfig = candidate.house ? houseColors[candidate.house as keyof typeof houseColors] : { bg: 'bg-secondary-400', light: 'bg-secondary-100 text-secondary-700 border-secondary-200' };
  return (
    <div className={`bg-white rounded-2xl border-2 overflow-hidden hover:shadow-lg transition-shadow ${candidate.isElected ? 'border-gold-400 ring-2 ring-gold-200' : 'border-secondary-100'}`}>
      {candidate.isElected && (
        <div className="bg-gold-500 text-white text-xs font-bold py-1.5 text-center flex items-center justify-center gap-1">
          <Trophy size={12} /> ELECTED
        </div>
      )}
      <div className="p-5 text-center">
        <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-secondary-100 border-4 border-secondary-50 shadow-md">
          {candidate.photoURL ? (
            <img src={candidate.photoURL} alt={candidate.name} className="w-full h-full object-cover object-top" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary-100">
              <Users size={28} className="text-primary-300" />
            </div>
          )}
        </div>
        <h3 className="font-heading font-bold text-secondary-900 text-base mb-0.5">{candidate.name}</h3>
        <p className="text-primary-600 font-medium text-xs mb-2">{candidate.position}</p>
        {candidate.class && (
          <p className="text-secondary-500 text-xs mb-3">{candidate.class}{candidate.section ? ` – ${candidate.section}` : ''}</p>
        )}
        {candidate.house && (
          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${houseConfig.light}`}>
            {candidate.house} House
          </span>
        )}
        {candidate.votes !== undefined && candidate.votes > 0 && (
          <div className="mt-3 pt-3 border-t border-secondary-100">
            <span className="text-secondary-500 text-xs font-medium">{candidate.votes} votes</span>
          </div>
        )}
        {candidate.manifesto && (
          <p className="mt-3 text-secondary-500 text-xs italic leading-relaxed line-clamp-2">"{candidate.manifesto}"</p>
        )}
      </div>
    </div>
  );
}

export default function ElectionPage() {
  useDocumentTitle('Student Election');
  const { data: candidates = [] } = useQuery({
    queryKey: ['election-candidates'],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, 'electionCandidates'), orderBy('position')));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }) as ElectionCandidate);
    },
  });

  const getByPosition = (position: string) => candidates.filter(c => c.position === position);

  return (
    <div>
      <PageHeader
        title="Student Council Election"
        subtitle="Our annual democratic election empowers students to choose their own leaders through a free, fair, and transparent process."
        breadcrumbs={[{ label: 'Home' }, { label: 'Student Life' }, { label: 'Election' }]}
      />

      {/* About Election */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm bg-primary-50 px-3 py-1.5 rounded-full mb-4">
                <Vote size={14} /> Annual Election
              </div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-900 mb-6">
                Democracy in Action
              </h2>
              <p className="text-secondary-600 leading-relaxed mb-4">
                The Student Council Election at Golden Future Secondary School is a highlight of our academic year. Every eligible student gets to vote for their preferred candidates for 12 leadership positions.
              </p>
              <p className="text-secondary-600 leading-relaxed mb-6">
                This democratic process teaches students the values of civic participation, responsible choice, and leadership. Elected council members serve the entire student body with integrity and dedication for the academic year.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary-50 rounded-xl">
                  <div className="font-bold text-primary-700 text-2xl">12</div>
                  <div className="text-secondary-600 text-sm">Positions Contested</div>
                </div>
                <div className="p-4 bg-gold-50 rounded-xl">
                  <div className="font-bold text-gold-700 text-2xl">Annual</div>
                  <div className="text-secondary-600 text-sm">Election Cycle</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-4">
                {allPositions.map((pos, i) => (
                  <div key={pos} className={`flex items-center gap-3 p-3 rounded-xl ${i % 2 === 0 ? 'bg-secondary-50' : 'bg-white border border-secondary-100'}`}>
                    <div className="w-7 h-7 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                      {i < 2 ? <Crown size={14} className="text-primary-700" /> :
                       i < 4 ? <Trophy size={14} className="text-primary-700" /> :
                       i < 8 ? <Shield size={14} className="text-primary-700" /> :
                       <Star size={14} className="text-primary-700" />}
                    </div>
                    <span className="text-secondary-700 text-sm font-medium">{pos}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Election Process */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-900 mb-4">How It Works</h2>
            <p className="text-secondary-500 max-w-xl mx-auto">Our election follows a structured, transparent process to ensure fairness and democratic representation.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {electionProcess.map((item, i) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-secondary-100 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="font-heading font-bold text-2xl text-primary-700">{item.step}</span>
                </div>
                <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center bg-primary-50 rounded-xl">
                  <item.icon size={18} className="text-primary-600" />
                </div>
                <h3 className="font-heading font-bold text-secondary-900 text-lg mb-2">{item.title}</h3>
                <p className="text-secondary-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="font-heading font-bold text-3xl text-secondary-900 mb-6">Eligibility Criteria</h2>
              <p className="text-secondary-600 mb-8">To stand as a candidate in the Student Council Election, students must meet all of the following criteria:</p>
              <ul className="space-y-3">
                {eligibilityCriteria.map((criteria, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
                    <span className="text-secondary-700 text-sm">{criteria}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-primary-900 rounded-2xl p-8 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-xl flex items-center justify-center">
                    <Vote size={22} className="text-gold-400" />
                  </div>
                  <h3 className="font-heading font-bold text-xl">Voting Rights</h3>
                </div>
                <ul className="space-y-3 text-primary-200 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle size={14} className="text-gold-400 mt-0.5 shrink-0" /> All students from Class 4 and above are eligible to vote</li>
                  <li className="flex items-start gap-2"><CheckCircle size={14} className="text-gold-400 mt-0.5 shrink-0" /> Each student gets one vote per position</li>
                  <li className="flex items-start gap-2"><CheckCircle size={14} className="text-gold-400 mt-0.5 shrink-0" /> Voting is conducted by secret ballot</li>
                  <li className="flex items-start gap-2"><CheckCircle size={14} className="text-gold-400 mt-0.5 shrink-0" /> Votes are counted by the Election Committee with teacher observers</li>
                  <li className="flex items-start gap-2"><CheckCircle size={14} className="text-gold-400 mt-0.5 shrink-0" /> Results are announced officially by the Principal</li>
                  <li className="flex items-start gap-2"><CheckCircle size={14} className="text-gold-400 mt-0.5 shrink-0" /> Elected members serve for one full academic year</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Candidates / Results */}
      {candidates.length > 0 && (
        <section className="py-20 bg-secondary-50">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-900 mb-4">
                {candidates.some(c => c.isElected) ? 'Election Results' : 'Current Candidates'}
              </h2>
            </motion.div>
            {allPositions.map((position) => {
              const posCandidates = getByPosition(position);
              if (posCandidates.length === 0) return null;
              return (
                <div key={position} className="mb-12">
                  <h3 className="font-heading font-bold text-xl text-secondary-800 mb-6 border-b border-secondary-200 pb-3">{position}</h3>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {posCandidates.map((c, i) => (
                      <motion.div key={c.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                        <CandidateCard candidate={c} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
