import { motion } from 'framer-motion';
import { Trophy, Crown, Shield, Star, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import PageHeader from '../../components/ui/PageHeader';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import type { StudentCouncilMember } from '../../types';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const houseColors = {
  Red: 'bg-red-100 border-red-300 text-red-700',
  Blue: 'bg-blue-100 border-blue-300 text-blue-700',
  Green: 'bg-green-100 border-green-300 text-green-700',
  Yellow: 'bg-yellow-100 border-yellow-300 text-yellow-700',
};

const positionGroups = [
  {
    label: 'School Leadership',
    icon: Crown,
    positions: ['Head Boy', 'Head Girl'],
  },
  {
    label: 'Sports Leadership',
    icon: Trophy,
    positions: ['Games Captain (Boys)', 'Games Captain (Girls)'],
  },
  {
    label: 'House Captains',
    icon: Shield,
    positions: ['Red House Captain', 'Blue House Captain', 'Green House Captain', 'Yellow House Captain'],
  },
  {
    label: 'House Vice Captains',
    icon: Star,
    positions: ['Red House Vice Captain', 'Blue House Vice Captain', 'Green House Vice Captain', 'Yellow House Vice Captain'],
  },
];

function CouncilCard({ member }: { member: Partial<StudentCouncilMember> & { position: string; name: string } }) {
  const houseColor = member.house ? houseColors[member.house as keyof typeof houseColors] : 'bg-secondary-100 border-secondary-300 text-secondary-600';
  return (
    <div className="bg-white rounded-2xl border border-secondary-100 overflow-hidden hover:shadow-lg transition-shadow text-center p-6 group">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-secondary-100 border-4 border-white shadow-md group-hover:border-primary-200 transition-colors">
        {member.photoURL ? (
          <img src={member.photoURL} alt={member.name} className="w-full h-full object-cover object-top" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Users size={32} className="text-secondary-300" />
          </div>
        )}
      </div>
      <h3 className="font-heading font-bold text-secondary-900 text-lg mb-1">{member.name}</h3>
      <p className="text-primary-600 font-semibold text-sm mb-2">{member.position}</p>
      {member.class && (
        <p className="text-secondary-500 text-xs mb-3">
          {member.class}{member.section ? ` – Section ${member.section}` : ''}
        </p>
      )}
      {member.house && (
        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${houseColor}`}>
          {member.house} House
        </span>
      )}
    </div>
  );
}

const defaultMembers: (Partial<StudentCouncilMember> & { position: string; name: string })[] = [
  { name: 'TBA – Head Boy', position: 'Head Boy', house: 'Blue', class: 'Class 10', section: 'A' },
  { name: 'TBA – Head Girl', position: 'Head Girl', house: 'Green', class: 'Class 10', section: 'B' },
  { name: 'TBA – Games Captain (Boys)', position: 'Games Captain (Boys)', house: 'Red', class: 'Class 9', section: 'A' },
  { name: 'TBA – Games Captain (Girls)', position: 'Games Captain (Girls)', house: 'Yellow', class: 'Class 9', section: 'B' },
  { name: 'TBA – Red House Captain', position: 'Red House Captain', house: 'Red', class: 'Class 9' },
  { name: 'TBA – Blue House Captain', position: 'Blue House Captain', house: 'Blue', class: 'Class 9' },
  { name: 'TBA – Green House Captain', position: 'Green House Captain', house: 'Green', class: 'Class 8', section: 'A' },
  { name: 'TBA – Yellow House Captain', position: 'Yellow House Captain', house: 'Yellow', class: 'Class 8', section: 'B' },
];

export default function StudentCouncil() {
  useDocumentTitle('Student Council');
  const { data: members = [] } = useQuery({
    queryKey: ['student-council'],
    queryFn: async () => {
      const snap = await getDocs(
        query(collection(db, 'studentCouncil'), orderBy('position'))
      );
      return snap.docs.map(d => ({ id: d.id, ...d.data() }) as StudentCouncilMember);
    },
  });

  const displayMembers = members.length > 0 ? members : defaultMembers as StudentCouncilMember[];

  const getMembersForPositions = (positions: string[]) =>
    displayMembers.filter(m => positions.includes(m.position));

  return (
    <div>
      <PageHeader
        title="Student Council"
        subtitle="Meet the student leaders who represent and serve the Golden Future student body with dedication and pride."
        breadcrumbs={[{ label: 'Home' }, { label: 'Student Life' }, { label: 'Student Council' }]}
      />

      {/* About Council */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm bg-primary-50 px-3 py-1.5 rounded-full mb-4">
                <Crown size={14} /> Student Leadership
              </div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-900 mb-6">
                Our Student Council
              </h2>
              <p className="text-secondary-600 leading-relaxed mb-4">
                The Student Council at Golden Future Secondary School is the official representative body of all students. Council members are democratically elected through our annual Student Council Election.
              </p>
              <p className="text-secondary-600 leading-relaxed mb-4">
                The council plays a vital role in school governance — voicing student concerns, organizing events, maintaining discipline, and fostering the spirit of the four houses: Red, Blue, Green, and Yellow.
              </p>
              <p className="text-secondary-600 leading-relaxed mb-6">
                Serving as a council member is one of the highest honors a student can achieve at our school. It develops leadership, communication, and responsibility.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '12', label: 'Council Positions' },
                  { value: '4', label: 'Houses Represented' },
                  { value: 'Annual', label: 'Democratic Election' },
                  { value: '100%', label: 'Student Participation' },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 bg-primary-50 rounded-xl">
                    <div className="font-bold text-primary-700 text-xl">{stat.value}</div>
                    <div className="text-secondary-600 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {['Red', 'Blue', 'Green', 'Yellow'].map((house) => (
                <div
                  key={house}
                  className={`rounded-2xl p-6 text-center border-2 ${houseColors[house as keyof typeof houseColors]}`}
                >
                  <div className={`w-14 h-14 rounded-full mx-auto mb-3 shadow-md ${
                    house === 'Red' ? 'bg-red-500' :
                    house === 'Blue' ? 'bg-blue-500' :
                    house === 'Green' ? 'bg-green-500' : 'bg-yellow-400'
                  }`} />
                  <div className="font-heading font-bold text-lg">{house} House</div>
                  <div className="text-sm opacity-70 mt-1">Captain & Vice Captain</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Council Members by Group */}
      {positionGroups.map((group, gi) => {
        const groupMembers = getMembersForPositions(group.positions);
        if (groupMembers.length === 0) return null;
        return (
          <section key={group.label} className={`py-16 ${gi % 2 === 0 ? 'bg-secondary-50' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-4">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-10"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <group.icon size={20} className="text-primary-700" />
                </div>
                <h2 className="font-heading font-bold text-2xl text-secondary-900">{group.label}</h2>
              </motion.div>
              <div className={`grid gap-6 ${groupMembers.length <= 2 ? 'sm:grid-cols-2 max-w-xl' : groupMembers.length <= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
                {groupMembers.map((member, i) => (
                  <motion.div
                    key={member.id ?? i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <CouncilCard member={member} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* If no real data, show placeholder grid */}
      {members.length === 0 && (
        <section className="py-16 bg-secondary-50">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-10">
              <h2 className="font-heading font-bold text-2xl text-secondary-900">Current Student Council (2082-2083)</h2>
              <p className="text-secondary-500 mt-2 text-sm">Positions will be filled following the annual election.</p>
            </motion.div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {defaultMembers.map((m, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <CouncilCard member={m} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
