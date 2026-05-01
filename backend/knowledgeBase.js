// Offline Knowledge Base for Indian Election Assistant
// Used as intelligent fallback when Gemini API quota is exhausted

const knowledgeEntries = [
  {
    keywords: ['eci', 'election commission', 'commission of india', 'who conducts'],
    answer: `## Election Commission of India (ECI)

The **Election Commission of India (ECI)** is an autonomous constitutional authority responsible for administering election processes in India. It was established on **January 25, 1950** under Article 324 of the Constitution.

### Key Facts:
- **Structure**: One Chief Election Commissioner (CEC) and two Election Commissioners
- **Appointment**: By the President of India
- **Tenure**: 6 years or until age 65 (whichever is earlier)
- **Independence**: CEC can only be removed through impeachment (like a Supreme Court judge)
- **Functions**: Supervises elections to Parliament, State Legislatures, and the offices of President and Vice-President

The ECI ensures **free, fair, and transparent** elections across the world's largest democracy.`
  },
  {
    keywords: ['voting age', 'minimum age', 'age to vote', 'eligible to vote', 'voter eligibility'],
    answer: `## Voting Age in India

The minimum voting age in India is **18 years**.

### Key Details:
- This was reduced from **21 to 18** by the **61st Constitutional Amendment Act, 1988**
- A citizen must be **18 years old on the qualifying date** (January 1 of the year of revision)
- You must be registered in the **electoral roll** of your constituency
- **No upper age limit** for voting
- Citizens of **unsound mind** or those disqualified by law cannot vote

To register, you need to fill **Form 6** and submit it to your local Electoral Registration Officer.`
  },
  {
    keywords: ['evm', 'electronic voting', 'voting machine'],
    answer: `## Electronic Voting Machines (EVMs)

**EVMs** are portable electronic devices used for recording votes in Indian elections since **1982** (first used in Kerala).

### How EVMs Work:
1. **Ballot Unit** — Displays candidate names and party symbols; voter presses button to vote
2. **Control Unit** — Operated by the presiding officer; stores vote count
3. **VVPAT** — Prints a paper slip showing who the voter voted for (visible for 7 seconds)

### Key Features:
- Runs on a **battery** (no electricity needed)
- Can record up to **3,840 votes**
- **Tamper-proof** — standalone, no network/internet connection
- Manufactured by **Bharat Electronics Limited (BEL)** and **Electronics Corporation of India (ECIL)**
- Each EVM has a **unique ID** for tracking`
  },
  {
    keywords: ['nota', 'none of the above', 'reject all'],
    answer: `## NOTA (None of the Above)

**NOTA** allows voters to officially reject all candidates in a constituency.

### Key Facts:
- Introduced by the **Supreme Court** in September 2013 (PUCL vs. Union of India case)
- First used in the **2013 Assembly Elections** (5 states)
- Appears as the **last option** on the EVM ballot unit
- **Symbol**: A ballot paper with a cross mark ✗

### Important Note:
Even if NOTA receives the **highest number of votes**, the candidate with the most votes among the contesting candidates **still wins**. NOTA votes are counted but do not lead to election cancellation.`
  },
  {
    keywords: ['mcc', 'model code', 'code of conduct'],
    answer: `## Model Code of Conduct (MCC)

The **Model Code of Conduct** is a set of guidelines issued by the ECI for political parties and candidates during elections.

### Key Rules:
- **No appeals** to caste or religion for votes
- **No bribery** or intimidation of voters
- **No government resources** for campaigning
- Campaigning must stop **48 hours before polling**
- **No victory processions** on results day
- Ministers cannot announce new projects/grants after MCC is in effect

### When It Applies:
- Comes into force from the **date of announcement** of elections
- Remains in effect until the **election process is complete**
- Violation can lead to **FIR, debarring candidates, or cancellation of election**`
  },
  {
    keywords: ['vvpat', 'paper audit', 'paper trail', 'voter verifiable'],
    answer: `## VVPAT (Voter Verifiable Paper Audit Trail)

**VVPAT** is an independent verification system attached to EVMs that allows voters to verify their vote.

### How It Works:
1. Voter presses a button on the EVM
2. VVPAT machine prints a **paper slip** with the candidate's name, serial number, and party symbol
3. The slip is visible through a **transparent window for 7 seconds**
4. It then drops into a **sealed box**

### Key Facts:
- Made **mandatory in all elections** by the Supreme Court in 2013
- First used in the **2014 Lok Sabha elections** (8 constituencies)
- Used in **all constituencies** since the 2019 Lok Sabha elections
- **5 random VVPATs** per assembly segment are matched with EVM results for verification`
  },
  {
    keywords: ['lok sabha', 'lower house', 'parliament', 'general election'],
    answer: `## Lok Sabha (House of the People)

The **Lok Sabha** is the lower house of India's bicameral Parliament.

### Key Facts:
- **Maximum strength**: 552 members (currently 543 elected + 2 nominated Anglo-Indians historically)
- **Term**: 5 years (can be dissolved earlier)
- **Elections**: Direct universal adult suffrage (every citizen 18+ can vote)
- **Speaker**: Presides over Lok Sabha sessions
- **Quorum**: 1/10th of total members

### Election Process:
- India is divided into **543 parliamentary constituencies**
- Each constituency elects **one member** (First-Past-The-Post system)
- The party/coalition with **majority (272+ seats)** forms the government
- The leader of the majority is appointed as **Prime Minister**`
  },
  {
    keywords: ['rajya sabha', 'upper house', 'council of states'],
    answer: `## Rajya Sabha (Council of States)

The **Rajya Sabha** is the upper house of India's Parliament.

### Key Facts:
- **Maximum strength**: 250 members (238 elected + 12 nominated by the President)
- **Permanent body** — cannot be dissolved (unlike Lok Sabha)
- **Term**: Members serve **6-year terms**; one-third retire every 2 years
- **Chairman**: The Vice-President of India
- Represents the **states and union territories**

### Election Process:
- Members elected by **elected MLAs** of state legislative assemblies
- Uses **Single Transferable Vote** with proportional representation
- **Not directly elected** by the public`
  },
  {
    keywords: ['voter id', 'voter card', 'epic', 'electoral photo', 'registration'],
    answer: `## Voter ID Card (EPIC)

The **Electoral Photo Identity Card (EPIC)**, commonly called Voter ID, is the primary identity document for voting.

### How to Get One:
1. Fill **Form 6** (online at nvsp.in or offline at BLO/ERO office)
2. Attach passport photo and address/age proof
3. Submit to the **Electoral Registration Officer (ERO)**
4. Verification by **Booth Level Officer (BLO)**
5. Card issued after approval

### Key Facts:
- **Free of cost**
- Contains: Name, photo, father's/husband's name, date of birth, address, constituency, EPIC number
- Can also use **12 alternative IDs** for voting (Aadhaar, passport, etc.)
- Apply online at **voters.eci.gov.in** or **NVSP portal**`
  },
  {
    keywords: ['how to vote', 'voting process', 'step by step', 'polling station', 'voting procedure', 'cast vote'],
    answer: `## How to Vote — Step-by-Step Guide

### Before Election Day:
1. Check your name on the **electoral roll** at electoralsearch.eci.gov.in
2. Locate your **polling station** (mentioned on voter slip)
3. Carry a **valid photo ID** (Voter ID, Aadhaar, Passport, etc.)

### At the Polling Station:
1. **Queue up** at your designated polling booth
2. **Identity verification** — Officer checks your ID and marks your name
3. **Indelible ink** applied on your left index finger
4. **Proceed** to the voting compartment
5. **Press the button** on the EVM next to your chosen candidate
6. **Verify** on the VVPAT slip (visible for 7 seconds)
7. **Exit** the polling station

### Important Rules:
- Polling hours: typically **7:00 AM to 6:00 PM**
- **No phones or cameras** allowed inside the voting booth
- **Maintain secrecy** of your vote
- **Paid leave** is mandatory for employees on election day`
  },
  {
    keywords: ['first past the post', 'fptp', 'electoral system', 'voting system'],
    answer: `## First-Past-The-Post (FPTP) System

India uses the **FPTP** electoral system for Lok Sabha and State Assembly elections.

### How It Works:
- Each constituency is a **single-member** constituency
- The candidate with the **most votes wins** (simple plurality)
- **No minimum percentage** required to win
- Winner does **not** need a majority (50%+), just more votes than any other candidate

### Pros:
- Simple to understand and implement
- Strong constituency-representative link
- Tends to produce stable governments

### Cons:
- Can lead to "wasted votes"
- A party can win a majority of seats without a majority of votes
- Smaller parties may be underrepresented`
  },
  {
    keywords: ['booth', 'polling booth', 'polling station', 'where to vote'],
    answer: `## Polling Stations

### How to Find Your Polling Station:
- Visit **electoralsearch.eci.gov.in**
- Use the **Voter Helpline App** (available on Android & iOS)
- Check your **voter slip** (distributed door-to-door before elections)
- Call the **toll-free helpline**: 1950

### Polling Station Facts:
- Located within **2 km** of every voter's residence
- Maximum **1,500 voters** per polling station
- Equipped with **ramps and facilities** for disabled voters
- **Separate queues** for women and senior citizens
- **Drinking water and shade** must be provided`
  },
  {
    keywords: ['penalty', 'violation', 'illegal', 'offence', 'punishment', 'bribery'],
    answer: `## Election Offences and Penalties

### Common Offences:
| Offence | Penalty |
|---------|---------|
| **Bribery** | Up to 1 year imprisonment + fine |
| **Booth capturing** | 3-5 years imprisonment + fine |
| **Impersonation** | Up to 1 year imprisonment + fine |
| **Violating MCC** | FIR + possible debarring |
| **Carrying weapons near booth** | Imprisonment under Arms Act |
| **Campaigning during silence period** | Up to 2 years imprisonment |
| **Paid news** | Disqualification possible |

### Reporting:
- Use the **cVIGIL app** to report violations with photo/video evidence
- Call **1950** (Voter Helpline)
- Complaints addressed within **100 minutes**`
  },
  {
    keywords: ['president', 'presidential election', 'president of india'],
    answer: `## Presidential Election in India

The President of India is elected through an **indirect election** by an Electoral College.

### Electoral College:
- Elected members of **both houses of Parliament** (Lok Sabha + Rajya Sabha)
- Elected members of **State Legislative Assemblies**
- Elected members of assemblies of **Delhi and Puducherry**

### Key Facts:
- Uses **Single Transferable Vote** with proportional representation
- **Term**: 5 years, can be re-elected
- **Eligibility**: Indian citizen, 35+ years old, qualified for Lok Sabha membership
- Value of each vote is calculated based on **state population**`
  },
  {
    keywords: ['delimitation', 'constituency', 'constituencies', 'boundary'],
    answer: `## Delimitation of Constituencies

**Delimitation** is the process of fixing boundaries of territorial constituencies based on population.

### Key Facts:
- Carried out by the **Delimitation Commission** (appointed by the President)
- Based on the **latest census data**
- Last full delimitation done in **2002** (based on 2001 census)
- Seats reserved for **SC/ST** are also decided during delimitation
- Orders have the **force of law** and cannot be challenged in court
- Currently, Lok Sabha has **543 constituencies** across India`
  },
  {
    keywords: ['hello', 'hi', 'hey', 'namaste', 'greetings'],
    answer: `Namaste! 🙏 Welcome to the **Indian Election Assistant**!

I can help you learn about:
- 🗳️ **Voting process** — How to register and cast your vote
- 🏛️ **Election Commission** — Structure and functions of the ECI
- 📋 **Model Code of Conduct** — Rules for parties and candidates
- 🔧 **EVMs & VVPAT** — How electronic voting works
- 📊 **Electoral system** — FPTP, constituencies, and more
- 🎓 **Voter registration** — How to get your Voter ID

Just ask me any question about Indian elections!`
  },
  {
    keywords: ['thank', 'thanks', 'bye', 'goodbye'],
    answer: `You're welcome! 🙏 Remember, **every vote counts** in strengthening our democracy. If you have more questions about the Indian election process, feel free to ask anytime!

**Key resources:**
- 🌐 eci.gov.in — Official ECI website
- 📱 Voter Helpline App — Check registration & polling station
- ☎️ 1950 — Voter Helpline number`
  }
];

/**
 * Finds the best matching answer from the local knowledge base
 * Uses keyword matching with scoring
 */
export function findLocalAnswer(query) {
  const q = query.toLowerCase().trim();
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of knowledgeEntries) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (q.includes(keyword)) {
        // Longer keyword matches are more specific, score higher
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore > 2) {
    return bestMatch.answer;
  }

  // Generic fallback
  return `Great question about Indian elections! Here's what I can tell you:

The **Indian electoral system** is the largest democratic exercise in the world, with over **900 million eligible voters**. Elections are conducted by the **Election Commission of India (ECI)**, an autonomous constitutional body.

### Quick Facts:
- **Voting age**: 18 years
- **Voting method**: Electronic Voting Machines (EVMs) with VVPAT verification
- **System**: First-Past-The-Post (FPTP)
- **Lok Sabha seats**: 543

Feel free to ask me specifically about:
- Voting process & registration
- EVMs and VVPAT
- Model Code of Conduct
- Election Commission
- NOTA
- Polling stations & procedures`;
}

/**
 * Returns a set of offline flashcards
 */
export function getOfflineFlashcards() {
  return [
    { question: "What is the Election Commission of India (ECI)?", answer: "An autonomous constitutional authority responsible for administering election processes in India at national and state levels. Established on January 25, 1950." },
    { question: "What is the minimum voting age in India?", answer: "18 years, as established by the 61st Constitutional Amendment Act of 1988 (reduced from 21)." },
    { question: "What does EVM stand for?", answer: "Electronic Voting Machine — a portable electronic device used for recording votes, first used in India in 1982 in Kerala." },
    { question: "What is VVPAT?", answer: "Voter Verifiable Paper Audit Trail — prints a paper slip showing the voter's choice, visible for 7 seconds, for independent verification." },
    { question: "What is the Model Code of Conduct?", answer: "Guidelines issued by the ECI for political parties and candidates during elections, enforced from the date of announcement until results are declared." }
  ];
}

/**
 * Returns a set of offline quiz questions
 */
export function getOfflineQuiz() {
  return [
    {
      question: "What is the minimum voting age in India?",
      options: ["16 years", "18 years", "21 years", "25 years"],
      correctAnswer: "18 years",
      explanation: "The 61st Constitutional Amendment Act of 1988 reduced the voting age from 21 to 18 years."
    },
    {
      question: "Which body conducts elections in India?",
      options: ["Supreme Court", "Parliament", "Election Commission of India", "President's Office"],
      correctAnswer: "Election Commission of India",
      explanation: "The ECI is an autonomous constitutional authority under Article 324, responsible for administering all elections in India."
    },
    {
      question: "What does NOTA stand for?",
      options: ["National Organization for Transparent Auditing", "None of the Above", "New Option for Total Assessment", "No Obligation to Accept"],
      correctAnswer: "None of the Above",
      explanation: "NOTA was introduced by the Supreme Court in 2013, allowing voters to officially reject all candidates."
    },
    {
      question: "How many constituencies does the Lok Sabha have?",
      options: ["435", "500", "543", "552"],
      correctAnswer: "543",
      explanation: "The Lok Sabha has 543 elected constituencies. The maximum allowed strength is 552."
    },
    {
      question: "When must election campaigning stop before polling?",
      options: ["24 hours", "48 hours", "72 hours", "12 hours"],
      correctAnswer: "48 hours",
      explanation: "As per the Model Code of Conduct, all campaigning must cease 48 hours before the polling begins (the 'silence period')."
    }
  ];
}
