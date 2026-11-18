# Review queue: CS001-CS043 (M2, M3a and M3b)

Claims written from knowledge that you should spot-check against the sources. Tick an item once checked; if it is wrong, say so and I will fix the text and the data. Nothing here has been verified against the original papers.

**How the evidence tags work:** an edge tagged `explicit` asserts the later work cites or credits the earlier one, so it is a checkable fact. An edge tagged `interpretive` is a reading of how ideas connect; read its "why" and decide if you agree.

## A. Content judgement calls (please read these first)

- [ ] **CS011 label changed.** The short label was "Chomsky hierarchy". The 1956 paper compares three models (finite-state, phrase-structure, transformational); the four-level hierarchy was formalised in Chomsky 1959. The label is now "Three models of language", and the text says the hierarchy came in 1959.
- [ ] **CS004 wording.** Turing 1936 proves undecidability for "circle-free" machines; "halting problem" is a later name. The text says "a question closely related to whether it will ever stop".
- [ ] **E014 (Turing to EDVAC) is interpretive on purpose.** The First Draft does not cite Turing and historians debate the direct influence; the "why" says so.
- [ ] **E019 / ghost G005 (Wiener, Cybernetics).** The claim that McCarthy chose "artificial intelligence" partly to distance the field from cybernetics is from his own later recollections. Tagged interpretive.
- [ ] **Ghost nodes added in this slice:** Boole (1854), Frege (1879), Hilbert's decision problem (1928), ENIAC (1945), Wiener (1948). The spec allowed up to three beyond its proposed list; Frege, ENIAC and Wiener are those three. Boole and Hilbert were on the proposed list.
- [ ] **CS007 credit.** The text notes that authorship credit for the First Draft was disputed, without taking a side.
- [ ] **Ghost nodes added in M3a (1962-1969):** Bush, *As We May Think* (1945); ALGOL 60 report (1960); Transistor and integrated circuit (1947). ALGOL 60 and the transistor were on the spec's proposed list; Bush is new. That makes 8 ghosts. The spec caps ghosts at 12 and still proposes 5 more (Perceptron, ARPANET, Hashcash/Merkle, LSTM, seq2seq), which would make 13: one will have to go or the cap rises.
- [ ] **CS021 Amdahl.** The 1967 paper argues in words; the formula speedup = 1/((1-p)+p/n) was derived from it later. The text says so.
- [ ] **CS019 Moore.** The diagram is schematic (a doubling each year), not Moore's exact plotted points. The ghost "Transistor and integrated circuit" stands for the technology he wrote about; his article does not cite the inventors.
- [ ] **CS018 FFT and CS024 TAOCP.** The FFT and Quicksort are treated in later volumes of TAOCP, not Volume 1, which is the work listed. Edges E034 and E037 are tagged interpretive for that reason.
- [ ] **CS023 NATO conference.** "About fifty people" and the sponsor are from memory; please check against the report.
- [ ] **Ghost nodes added in M3b (1970-1979):** Multics (1965); IMS and CODASYL databases (1968); Simula 67 (1967); ARPANET (1969). That makes 12. The ghost cap was raised to 20 at your direction.
- [ ] **Explicit edges in M3b that need a citation check:** E066 (ARPANET to Cerf-Kahn), E069 (Multics to UNIX), E071 (Multics to Saltzer-Schroeder), E074 (Smalltalk to Design Patterns), E058 (Codd to Chen). I judged these likely but have not checked the papers.
- [ ] **CS031 year.** Karp's paper is from 1972 (the 1972 symposium); the CSV lists 1973. I kept the CSV year on the canvas.
- [ ] **CS036 dates.** Newell and Simon gave the lecture for the 1975 Turing Award; it was published in 1976, which is the year in the CSV.
- [ ] **CS038 manual.** The Smalltalk-72 manual describes an early version that was soon replaced; the text says so. The claims about Kay's influences (Simula, LISP, Sketchpad, Logo) are from his own later accounts, so the related edges are interpretive.
- [ ] **CS027, CS039, CS043 chain.** Codd to Chen and Codd to System R are tagged explicit; E056 (IMS/CODASYL to Codd) is interpretive because I am not sure which systems Codd names.
- [ ] **CS040 and CS037 history.** GCHQ researchers found public-key ideas earlier in secret (declassified 1997). The text does not mention it; add it if you want.
- [ ] **CS034 chart.** The Brooks's-law chart is schematic, not data.

## B. Explicit edges to verify (29)

For each, confirm that the later work cites or credits the earlier one in the way the "why" says.

- [ ] **E001** G003 Frege: Begriffsschrift (1879) -> CS001 Principia Mathematica (1910) (builds_on): Russell and Whitehead took up Frege's project of deriving arithmetic from pure logic, and rebuilt it with a hierarchy of types after Russell's paradox broke Frege's system.
- [ ] **E002** CS001 Principia Mathematica (1910) -> CS002 Incompleteness (1931) (builds_on): Gödel took Principia's kind of formal system as the object to analyse, and turned its own machinery of symbols and rules against the hope that it could prove everything.
- [ ] **E003** G002 Hilbert's decision problem (1928) -> CS002 Incompleteness (1931) (builds_on): Gödel answered Hilbert's programme, which asked for a finitary proof that mathematics is consistent and complete, by showing that no such proof can exist for a system as strong as arithmetic.
- [ ] **E004** CS002 Incompleteness (1931) -> CS003 Lambda calculus (1936) (builds_on): Church's proof of an unsolvable problem uses Gödel's technique of encoding formulas as numbers, and his definition of calculable functions is matched against Gödel and Herbrand's recursive functions.
- [ ] **E005** CS002 Incompleteness (1931) -> CS004 Turing machines (1936) (builds_on): Turing's undecidability proof uses a Gödel-style diagonal argument and the idea of encoding a procedure as data, moving the idea from provability to computation.
- [ ] **E006** G002 Hilbert's decision problem (1928) -> CS004 Turing machines (1936) (builds_on): The title names the target: Turing shows the Entscheidungsproblem, the search for a mechanical test of logical validity, has no solution.
- [ ] **E007** CS003 Lambda calculus (1936) -> CS004 Turing machines (1936) (rival): Two independent definitions of 'effectively calculable', by lambda calculus and by machine, turned out to cover exactly the same functions, which is why the Church–Turing thesis is trusted.
- [ ] **E008** CS001 Principia Mathematica (1910) -> CS006 McCulloch-Pitts neurons (1943) (builds_on): McCulloch and Pitts cite Principia and write neural activity in its logical notation, treating a network's behaviour as propositions that can be derived.
- [ ] **E009** CS004 Turing machines (1936) -> CS006 McCulloch-Pitts neurons (1943) (builds_on): They argue that networks given a tape can compute whatever a Turing machine can, tying neurons to the new definition of computation.
- [ ] **E010** G001 Boole: Laws of Thought (1854) -> CS005 Switching circuits (1938) (builds_on): Shannon's thesis explicitly applies Boole's algebra of logic to switching circuits.
- [ ] **E013** CS006 McCulloch-Pitts neurons (1943) -> CS007 EDVAC report (1945) (builds_on): The First Draft explicitly uses the McCulloch–Pitts idealised neuron as its basic switching element, so the design can be reasoned about independently of the hardware.
- [ ] **E016** CS004 Turing machines (1936) -> CS009 Can machines think? (1950) (builds_on): Turing argues that because his universal machine can imitate any other computing machine, a digital computer could in principle imitate a mind.
- [ ] **E018** CS006 McCulloch-Pitts neurons (1943) -> CS010 Dartmouth AI (1955) (builds_on): The proposal lists neuron nets among its topics and names McCulloch and Pitts among those who had worked on the problem.
- [ ] **E020** CS008 Information theory (1948) -> CS011 Three models of language (1956) (overcomes_limit): Chomsky tests Shannon-style Markov models of language and shows finite-state sources cannot generate English, then moves to richer phrase-structure grammars.
- [ ] **E022** CS003 Lambda calculus (1936) -> CS014 LISP (1960) (builds_on): McCarthy adopts Church's lambda notation to define functions in LISP and builds the language around functions applied to arguments.
- [ ] **E027** CS004 Turing machines (1936) -> CS020 Computational complexity (1965) (builds_on): Hartmanis and Stearns define computational complexity by counting steps of Turing machines, adding cost to Turing's question of what is computable.
- [ ] **E028** CS014 LISP (1960) -> CS047 SICP (1984) (builds_on): Scheme, a LISP dialect, is the language in which the book teaches programming as the building of abstractions.
- [ ] **E029** G006 Bush: As We May Think (1945) -> CS015 Augmenting intellect (1962) (builds_on): Engelbart credits Vannevar Bush's vision of a memex, a desk that stores and links a person's records, as the seed of his framework for augmenting the intellect.
- [ ] **E033** G007 ALGOL 60 report (1960) -> CS016 Quicksort (1962) (builds_on): Hoare published Quicksort as an ALGOL 60 procedure; the language's support for recursion is what makes the algorithm short to state.
- [ ] **E042** CS021 Amdahl's law (1967) -> CS052 Quantitative architecture (1990) (builds_on): Hennessy and Patterson make Amdahl's law the standard statement of the principle that speedup is limited by the part of a task you do not improve.
- [ ] **E058** CS027 Relational model (1970) -> CS039 Entity-relationship (1976) (builds_on): Chen sets his model beside Codd's relational model and shows it covers it, offering entities and relationships as the higher-level view from which tables are derived.
- [ ] **E059** CS027 Relational model (1970) -> CS043 System R optimizer (1979) (builds_on): System R was built to show that Codd's relational model could be made fast, with the optimizer choosing how to answer queries that state only what is wanted.
- [ ] **E060** CS028 Cook: NP-completeness (1971) -> CS031 Karp's 21 problems (1973) (builds_on): Karp starts from Cook's result that satisfiability is NP-complete and shows, by chains of polynomial-time reductions, that twenty more well-known problems are just as hard.
- [ ] **E066** G012 ARPANET (1969) -> CS032 TCP/IP (1974) (builds_on): Cerf and Kahn start from the ARPANET's experience with packet switching and design a protocol that joins it, and other networks, into one internetwork.
- [ ] **E069** G009 Multics (1965) -> CS033 UNIX (1974) (builds_on): Ritchie and Thompson built UNIX after Bell Labs left Multics, carrying over its hierarchical file system and its command interpreter as an ordinary program, in a far smaller system.
- [ ] **E070** CS033 UNIX (1974) -> CS041 The C language (1978) (builds_on): C was designed to write UNIX, and the book presents it as the language of that system.
- [ ] **E071** G009 Multics (1965) -> CS035 Protection principles (1975) (builds_on): The principles come from the authors' experience designing Multics, whose protection mechanisms the paper uses as its main examples.
- [ ] **E074** CS038 Smalltalk (1976) -> CS054 Design patterns (1994) (builds_on): Design Patterns draws its examples largely from Smalltalk and C++, and several patterns, such as Model-View-Controller, come from the Smalltalk community.
- [ ] **E075** CS037 Diffie-Hellman (1976) -> CS040 RSA (1978) (builds_on): RSA supplied what Diffie and Hellman had only proposed: a concrete trapdoor function that makes public-key encryption and digital signatures work.

## C. Interpretive edges to read (57)

- [ ] **E011** CS005 Switching circuits (1938) -> CS007 EDVAC report (1945) (builds_on): Boolean switch algebra became the standard way to design the logic of digital machines, the circuits that EDVAC-style computers are made of.
- [ ] **E012** CS005 Switching circuits (1938) -> CS008 Information theory (1948) (builds_on): Shannon moved from the algebra of two-valued switches to the mathematics of two-valued information, carrying the binary view from circuits to messages.
- [ ] **E014** CS004 Turing machines (1936) -> CS007 EDVAC report (1945) (builds_on): Keeping instructions in memory as data realises the universal machine's central idea in hardware, though the report does not cite Turing and historians debate the direct influence.
- [ ] **E015** G004 ENIAC (1945) -> CS007 EDVAC report (1945) (overcomes_limit): ENIAC had to be rewired to change tasks, which took days; a single memory holding the program removes that bottleneck.
- [ ] **E017** CS009 Can machines think? (1950) -> CS010 Dartmouth AI (1955) (builds_on): The Dartmouth proposal turns Turing's question into a research programme, conjecturing that any feature of intelligence can be so precisely described that a machine can simulate it.
- [ ] **E019** G005 Wiener: Cybernetics (1948) -> CS010 Dartmouth AI (1955) (rival): Cybernetics, with its focus on feedback and control, was the competing framing of the early 1950s; the new name 'artificial intelligence' marked a different emphasis on symbols and programs.
- [ ] **E021** CS007 EDVAC report (1945) -> CS012 FORTRAN (1957) (builds_on): Stored-program machines made programming a matter of writing instructions into memory; FORTRAN automated that writing so scientists could use them without machine code.
- [ ] **E023** CS004 Turing machines (1936) -> CS014 LISP (1960) (builds_on): LISP's eval, an interpreter for the language written in the language, plays the role of Turing's universal machine: one program that can run any other.
- [ ] **E024** CS010 Dartmouth AI (1955) -> CS014 LISP (1960) (builds_on): LISP was created to give the AI programme a language for symbolic work: lists, recursion and automatic memory management.
- [ ] **E025** CS012 FORTRAN (1957) -> CS014 LISP (1960) (rival): Two answers to what a programming language is for: FORTRAN for fast numeric computation, LISP for symbolic structures and recursion.
- [ ] **E026** CS013 Shortest paths (1959) -> CS020 Computational complexity (1965) (generalizes): Dijkstra's analysis of how an algorithm's cost grows with problem size foreshadows complexity theory, which turns that accounting into a general measure.
- [ ] **E030** CS015 Augmenting intellect (1962) -> CS017 Sketchpad (1963) (builds_on): Sketchpad is an early working case of the augmentation idea: a person and a computer thinking together through a shared picture rather than through typed codes.
- [ ] **E031** CS015 Augmenting intellect (1962) -> CS038 Smalltalk (1976) (builds_on): Smalltalk's overlapping windows and its goal of a personal medium for thought carry Engelbart's aim of augmenting the intellect into personal computing.
- [ ] **E032** CS015 Augmenting intellect (1962) -> CS051 World Wide Web (1989) (builds_on): Berners-Lee's proposal for linked, shared information continues the hypertext thread running from Bush and Engelbart toward networked collaboration.
- [ ] **E034** CS016 Quicksort (1962) -> CS024 Art of Computer Prog. (1968) (builds_on): Knuth's series gathers sorting methods like Quicksort and analyses their average and worst cases, in the style of analysis the series made standard.
- [ ] **E035** CS017 Sketchpad (1963) -> CS038 Smalltalk (1976) (builds_on): Smalltalk's objects and direct manipulation echo Sketchpad's master and instance drawings and its interactive pictures; Alan Kay has credited Sketchpad as an inspiration.
- [ ] **E036** CS008 Information theory (1948) -> CS018 FFT (1965) (builds_on): Shannon's view of signals in terms of frequencies and samples makes spectra worth computing; the FFT makes computing them cheap enough for everyday signal processing and communications.
- [ ] **E037** CS018 FFT (1965) -> CS024 Art of Computer Prog. (1968) (builds_on): Later volumes of Knuth's series treat the FFT as standard material when analysing fast arithmetic and polynomial algorithms.
- [ ] **E038** G008 Transistor and integrated circuit (1947) -> CS019 Moore's law (1965) (builds_on): Moore's forecast is about integrated circuits, the packing of transistors onto a single chip, and asks how fast that packing will improve.
- [ ] **E039** CS019 Moore's law (1965) -> CS052 Quantitative architecture (1990) (builds_on): Hennessy and Patterson's quantitative design method takes technology trends, such as the steady growth in transistors per chip, as the baseline for architecture.
- [ ] **E040** CS020 Computational complexity (1965) -> CS028 Cook: NP-completeness (1971) (builds_on): Cook's NP-completeness works inside the framework of time-bounded Turing machine computation that Hartmanis and Stearns set up, asking which problems can be solved in polynomial time.
- [ ] **E041** CS007 EDVAC report (1945) -> CS021 Amdahl's law (1967) (builds_on): Amdahl analyses the limits of speeding up the sequential stored-program machine by adding processors.
- [ ] **E043** CS012 FORTRAN (1957) -> CS022 GOTO considered harmful (1968) (overcomes_limit): Structured control flow answers the tangled branching that early languages such as FORTRAN encouraged.
- [ ] **E044** G007 ALGOL 60 report (1960) -> CS022 GOTO considered harmful (1968) (builds_on): ALGOL 60's blocks, conditionals and loops show the structured alternative Dijkstra argues programs should be built from.
- [ ] **E045** CS022 GOTO considered harmful (1968) -> CS023 NATO SE conference (1968) (builds_on): Dijkstra's case for disciplined program structure was part of the debate at the NATO conference that named the software crisis.
- [ ] **E046** CS022 GOTO considered harmful (1968) -> CS025 THE multiprogramming (1968) (builds_on): The THE system applies the same discipline of structure to a whole operating system, built in layers that can each be understood and tested on their own.
- [ ] **E047** CS022 GOTO considered harmful (1968) -> CS026 Hoare logic (1969) (builds_on): Hoare's axioms cover the structured constructs Dijkstra argued for, sequence, choice and loop, whose pieces can be reasoned about one at a time.
- [ ] **E048** CS001 Principia Mathematica (1910) -> CS026 Hoare logic (1969) (builds_on): Hoare's proofs about programs use the deductive style of formal logic: axioms and rules of inference from which properties are derived step by step.
- [ ] **E049** G007 ALGOL 60 report (1960) -> CS026 Hoare logic (1969) (builds_on): Hoare builds his axioms for the kind of structured, ALGOL-like language the ALGOL 60 report had defined.
- [ ] **E050** CS026 Hoare logic (1969) -> CS044 Model checking (1981) (overcomes_limit): Model checking removes the burden of hand-written Hoare-style proofs by checking finite-state systems automatically.
- [ ] **E051** CS026 Hoare logic (1969) -> CS053 Liskov substitution (1994) (builds_on): Liskov and Wing specify the behaviour of subtypes with preconditions and postconditions, the vocabulary Hoare's triples introduced.
- [ ] **E052** CS023 NATO SE conference (1968) -> CS029 Modular decomposition (1972) (builds_on): Parnas's criteria for splitting systems into modules respond to the software crisis the NATO conference described and to proposals there such as reusable components.
- [ ] **E053** CS023 NATO SE conference (1968) -> CS034 Mythical Man-Month (1975) (builds_on): Brooks, writing from his experience of the IBM OS/360 project, takes up the conference's diagnosis that large software projects are late and unreliable and asks why.
- [ ] **E054** CS025 THE multiprogramming (1968) -> CS033 UNIX (1974) (builds_on): UNIX's processes and its small, layered design echo the THE system's idea of building an operating system as a hierarchy of simple parts.
- [ ] **E055** CS025 THE multiprogramming (1968) -> CS042 Logical clocks (1978) (new_domain): Lamport's logical clocks address coordination of independent processes, the problem Dijkstra's semaphores solved inside one machine, now across machines.
- [ ] **E056** G010 IMS and CODASYL databases (1968) -> CS027 Relational model (1970) (overcomes_limit): Codd's model answers the dependence problems of the tree and network systems of the day, where programs followed stored pointers and broke when the storage layout changed.
- [ ] **E057** CS027 Relational model (1970) -> CS030 B-trees (1972) (builds_on): Separating what a query asks from how data is stored made access structures such as indexes a design problem of their own, and B-trees became the standard answer.
- [ ] **E061** CS028 Cook: NP-completeness (1971) -> CS037 Diffie-Hellman (1976) (new_domain): Diffie and Hellman draw on complexity theory for the idea of a function that is easy to compute but hard to invert, the property public-key schemes need.
- [ ] **E062** CS025 THE multiprogramming (1968) -> CS029 Modular decomposition (1972) (builds_on): THE showed that a system can be understood part by part; Parnas asks what each part should hide, so that a change to one decision stays inside one module.
- [ ] **E063** CS029 Modular decomposition (1972) -> CS053 Liskov substitution (1994) (builds_on): Liskov and Wing's behavioural subtyping builds on abstract data types, where a module's interface, not its internals, is what other code may rely on.
- [ ] **E064** CS029 Modular decomposition (1972) -> CS054 Design patterns (1994) (builds_on): Design patterns advise programming to interfaces and hiding implementation choices, Parnas's principle applied to object-oriented design.
- [ ] **E065** CS030 B-trees (1972) -> CS043 System R optimizer (1979) (builds_on): System R's access path selection chooses among scans and B-tree indexes, so its optimizer depends on indexes of the kind Bayer and McCreight introduced.
- [ ] **E067** CS032 TCP/IP (1974) -> CS046 End-to-end argument (1984) (builds_on): The end-to-end arguments generalise a choice at the heart of TCP: keep the network simple and put reliability in the hosts at the ends.
- [ ] **E068** CS032 TCP/IP (1974) -> CS051 World Wide Web (1989) (new_domain): The Web is an application built on the internetwork TCP/IP created, using it to carry linked documents between machines anywhere.
- [ ] **E072** G011 Simula 67 (1967) -> CS038 Smalltalk (1976) (builds_on): Simula 67's classes and objects were the starting point for Smalltalk's idea of computation as objects, which Kay then simplified into message passing.
- [ ] **E073** CS014 LISP (1960) -> CS038 Smalltalk (1976) (builds_on): Kay has said LISP's simplicity and its idea of a language defined in itself shaped Smalltalk's design.
- [ ] **E076** CS008 Information theory (1948) -> CS037 Diffie-Hellman (1976) (builds_on): Shannon's information-theoretic view of secrecy sets the standard of perfect security; Diffie and Hellman move to a computational standard that needs no pre-shared key.
- [ ] **E077** CS037 Diffie-Hellman (1976) -> CS067 Bitcoin (2008) (builds_on): Bitcoin relies on digital signatures, made possible by public-key cryptography, to prove who may spend a coin.
- [ ] **E078** CS010 Dartmouth AI (1955) -> CS036 Symbols and search (1976) (builds_on): Newell and Simon's lecture states and defends the research programme the Dartmouth proposal launched: that intelligence is the manipulation of symbols.
- [ ] **E079** CS014 LISP (1960) -> CS036 Symbols and search (1976) (builds_on): List processing, the style of programming that LISP and Newell and Simon's IPL embody, is the practical form of the symbol-system hypothesis.
- [ ] **E080** CS036 Symbols and search (1976) -> CS048 Backpropagation (1986) (rival): Connectionism offered a rival picture of intelligence as patterns learned in connection weights, rather than explicit symbols and search.
- [ ] **E081** CS034 Mythical Man-Month (1975) -> CS050 No Silver Bullet (1987) (builds_on): Brooks's later essay returns to why software remains hard, separating essential difficulties from accidental ones.
- [ ] **E082** CS042 Logical clocks (1978) -> CS045 Byzantine generals (1982) (builds_on): The Byzantine generals paper extends the study of ordering events across machines to the harder case where some of the machines are faulty or lying.
- [ ] **E083** CS042 Logical clocks (1978) -> CS058 Paxos (1998) (builds_on): Paxos uses the state-machine idea from Lamport's clocks paper: replicas that apply the same commands in the same order stay identical.
- [ ] **E084** CS042 Logical clocks (1978) -> CS069 Spanner (2012) (overcomes_limit): Spanner uses tightly synchronised clocks to order transactions worldwide, the physical-time answer to the ordering problem Lamport solved with logical clocks.
- [ ] **E085** CS043 System R optimizer (1979) -> CS049 Shared nothing (1986) (builds_on): Shared-nothing parallel databases keep declarative queries and cost-based optimisation and spread the work across many machines.
- [ ] **E086** G007 ALGOL 60 report (1960) -> CS041 The C language (1978) (builds_on): C's block structure and structured control flow descend from ALGOL through BCPL and B.

## D. Claims by paper

### CS001 Principia Mathematica (1910)
- [ ] Logic Theorist proved theorems from Principia chapter 2 (Newell, Simon and Shaw, 1956)
- [ ] McCulloch and Pitts cite Principia (edge E008)
- [ ] Frege's system was undermined by Russell's paradox (1901-02) (edge E001)

### CS002 Incompleteness (1931)
- [ ] Gödel's section 4 states the results do not contradict Hilbert's formalist viewpoint (basis for tagging E003 explicit)
- [ ] Turing's paper cites Gödel (basis for tagging E005 explicit)

### CS003 Lambda calculus (1936)
- [ ] Church's 1936 paper cites Gödel and uses Gödel's arithmetization (basis for E004 explicit)
- [ ] McCarthy 1960 cites Church's lambda notation (basis for E022 explicit)
- [ ] Equivalence of lambda-definable and general recursive functions was shown by Church/Kleene around 1935-36

### CS004 Turing machines (1936)
- [ ] Turing's paper proves an undecidability result for 'circle-free' machines; the halting-problem phrasing came later, so the text says 'closely related to whether it will ever stop'
- [ ] Equivalence with lambda-definability was shown in Turing's 1937 follow-up and a note appended to the paper

### CS005 Switching circuits (1938)
- [ ] Shannon's paper builds on Boole; the thesis is from 1937, the journal paper 1938 (basis for E010 explicit)

### CS006 McCulloch-Pitts neurons (1943)
- [ ] McCulloch and Pitts cite Principia, Carnap, Hilbert and Ackermann, and Turing (basis for E008 and E009 explicit)
- [ ] Von Neumann's First Draft cites McCulloch and Pitts (basis for E013 explicit)
- [ ] Dartmouth proposal names Pitts and McCulloch among those who worked on neuron nets (E018)

### CS007 EDVAC report (1945)
- [ ] First Draft cites McCulloch and Pitts for its idealised neuron elements (basis for E013 explicit)
- [ ] Whether von Neumann drew directly on Turing's universal machine is debated; E014 is tagged interpretive and says so
- [ ] Credit dispute: Eckert and Mauchly vs von Neumann as sole author of the draft
- [ ] Manchester Baby ran the first stored program in 1948; EDSAC entered service in 1949

### CS008 Information theory (1948)
- [ ] E012 (CS005 to CS008) is interpretive: it reads Shannon's move from binary switches to binary information as one line of thought

### CS009 Can machines think? (1950)
- [ ] Turing 1950 argues from universality of digital computers (basis for E016 explicit)
- [ ] E017 (CS009 to CS010) is interpretive; the Dartmouth proposal does not cite Turing
- [ ] Turing predicted a 30% chance of fooling an interrogator after 5 minutes by about 2000

### CS010 Dartmouth AI (1955)
- [ ] McCarthy has said he chose 'artificial intelligence' partly to distance the field from cybernetics (basis for ghost G005 and edge E019, tagged interpretive)
- [ ] Newell and Simon presented the Logic Theorist at the Dartmouth workshop
- [ ] Proposal names Pitts and McCulloch among neuron-net workers (E018)
- [ ] Seven topics in the proposal: verify list against the original text
- [ ] IPL (Newell/Simon list-processing language) preceded LISP; Minsky built a neural learning machine (SNARC) as a student; Shannon wrote on computer chess (1950)

### CS011 Three models of language (1956)
- [ ] The 1956 paper compares three models; the four-level hierarchy was formalised in Chomsky 1959 (the node's short label was changed from 'Chomsky hierarchy' to 'Three models of language' for this reason)
- [ ] Chomsky 1956 discusses Shannon-style Markov models of language (basis for E020 explicit)
- [ ] Statistical methods dominating speech recognition and translation from the 1980s

### CS012 FORTRAN (1957)
- [ ] Delivered for the IBM 704 in 1957; the often-quoted team effort (about 18 person-years) was not stated in the text; verify before adding it
- [ ] E021 (CS007 to CS012) is interpretive

### CS013 Shortest paths (1959)
- [ ] OSPF uses shortest-path-first (Dijkstra) computation
- [ ] E026 (CS013 to CS020) is interpretive: a reading that Dijkstra's cost accounting foreshadows complexity theory
- [ ] The paper solves two problems: the shortest path and the minimum spanning tree

### CS014 LISP (1960)
- [ ] McCarthy 1960 cites Church's lambda notation (basis for E022 explicit)
- [ ] E023: McCarthy draws the analogy of eval to a universal machine; tagged interpretive until the 1960 text is checked
- [ ] Garbage collection was introduced in the LISP design (described in the 1960 paper)
- [ ] Seven-primitive list: car, cdr, cons, atom, eq plus conditionals and lambda; check the exact primitive set against the paper

### CS015 Augmenting intellect (1962)
- [ ] Engelbart 1962 cites Vannevar Bush's As We May Think (basis for ghost G006 and edge E029, tagged explicit)
- [ ] 1968 demonstration showed mouse, windows, hypertext, shared-screen collaboration and video conferencing
- [ ] E031 and E032 (Engelbart to Smalltalk and to the Web proposal) are interpretive readings of influence

### CS016 Quicksort (1962)
- [ ] Hoare invented Quicksort while working on machine translation in Moscow (his own recollection)
- [ ] The 1962 paper presents the algorithm in ALGOL 60 (basis for ghost G007 and edge E033, tagged explicit)
- [ ] Introsort (Musser, 1997) is the usual hybrid that guards against the worst case

### CS017 Sketchpad (1963)
- [ ] Sutherland's thesis was done at MIT on the TX-2 with a light pen
- [ ] Alan Kay has credited Sketchpad as an influence on Smalltalk and object-oriented ideas (basis for E035, tagged interpretive)
- [ ] E030 (Engelbart to Sketchpad) is an interpretive reading: both treat the computer as an interactive partner in thinking

### CS018 FFT (1965)
- [ ] Gauss's unpublished use of the same idea around 1805 (rediscovered by Heideman, Johnson and Burrus, 1984)
- [ ] Seismic test-ban monitoring as a motivating application (Tukey's account)
- [ ] E036 (Shannon to FFT) and E037 (FFT to TAOCP) are interpretive; Knuth treats the FFT in later volumes, not Volume 1

### CS019 Moore's law (1965)
- [ ] The 1965 forecast was a doubling every year; Moore revised it to every two years in 1975
- [ ] Dennard scaling ended in the mid-2000s, after which clock speeds flattened and multicore followed
- [ ] The curve in the diagram is schematic (a doubling each year), not Moore's exact plotted points
- [ ] Ghost G008 is titled 'Transistor and integrated circuit' (1947); E038 is interpretive because Moore does not cite the inventors

### CS020 Computational complexity (1965)
- [ ] Hartmanis and Stearns were at General Electric Research Laboratory; Turing Award 1993
- [ ] Their hierarchy theorem: given sufficiently more time, strictly more can be computed
- [ ] E040 (to Cook) is interpretive: Cook's framework is polynomial time on Turing machines; check whether Cook cites Hartmanis and Stearns directly

### CS021 Amdahl's law (1967)
- [ ] The 1967 paper states the argument in words; the speedup formula was derived afterwards by others
- [ ] Amdahl's 1967 sentence: parallel effort is wasted unless accompanied by sequential improvements of the same magnitude
- [ ] Gustafson's law (1988) is the standard counter-argument
- [ ] E042 (to Hennessy and Patterson) is tagged explicit: they present Amdahl's law as a central principle

### CS022 GOTO considered harmful (1968)
- [ ] Wirth, as editor, retitled Dijkstra's letter 'Go To Statement Considered Harmful' (Dijkstra's original title was 'A case against the goto statement')
- [ ] The quoted claim about programmer quality and goto density is paraphrased from the letter
- [ ] Knuth's 1974 paper 'Structured Programming with go to Statements' argues for a balanced view
- [ ] E043 and E044 are interpretive: they read FORTRAN as the practice and ALGOL 60 as the structured alternative

### CS023 NATO SE conference (1968)
- [ ] Conference at Garmisch, Germany, October 1968, sponsored by the NATO Science Committee; report edited by Naur and Randell
- [ ] 'About fifty people' attended: verify the count and the number of countries
- [ ] McIlroy's 'Mass produced software components' was presented at Garmisch
- [ ] A second NATO conference followed in Rome in 1969
- [ ] E052 and E053 (to Parnas and to Brooks) are interpretive

### CS024 Art of Computer Prog. (1968)
- [ ] Volume dates: 1 (1968), 2 (1969), 3 (1973), 4A (2011); Volume 5 planned
- [ ] Knuth received the 1974 Turing Award, citing TAOCP among other contributions
- [ ] TeX was prompted by dissatisfaction with the typesetting of the second edition of Volume 2 (1977)
- [ ] E034 and E037 (Quicksort and FFT into TAOCP) are interpretive: those algorithms are treated in later volumes

### CS025 THE multiprogramming (1968)
- [ ] The six levels of THE: 0 processor allocation, 1 memory and drum, 2 console message interpreter, 3 I/O buffering, 4 user programs, 5 operator
- [ ] Semaphores (P and V) are described in the THE paper and in Dijkstra's earlier notes on cooperating sequential processes
- [ ] E054 (to UNIX) and E055 (to Lamport) are interpretive readings of influence

### CS026 Hoare logic (1969)
- [ ] Hoare 1969 opens with the claim that programming is an exact science (paraphrased in the text)
- [ ] Floyd's 1967 'Assigning meanings to programs' preceded Hoare's work
- [ ] E048 (Principia to Hoare) is an interpretive reading of the deductive lineage
- [ ] E049 (ALGOL 60 to Hoare) is tagged interpretive; verify whether the paper cites the ALGOL 60 report before upgrading it

### CS027 Relational model (1970)
- [ ] Codd was at IBM Research (San Jose) when he wrote the 1970 paper; Turing Award 1981
- [ ] SQL grew out of IBM's SEQUEL language for System R
- [ ] E056 (IMS and CODASYL to Codd) is interpretive: confirm which systems Codd's paper names
- [ ] E058 (Codd to Chen) is tagged explicit: Chen's paper discusses and cites the relational model

### CS028 Cook: NP-completeness (1971)
- [ ] The name NP and the term NP-complete came into use after Cook's paper (Karp 1972); Cook's paper works with 'P-reducibility' and tautologies
- [ ] Cook received the 1982 Turing Award
- [ ] E040 (Hartmanis-Stearns to Cook) is interpretive; check whether Cook cites their paper
- [ ] E061 (Cook to Diffie-Hellman) is interpretive

### CS029 Modular decomposition (1972)
- [ ] The example in the paper is a KWIC (keyword in context) index
- [ ] E052 (NATO conference to Parnas) is interpretive
- [ ] E062 (THE to Parnas), E063 (Parnas to Liskov-Wing) and E064 (Parnas to Design Patterns) are interpretive

### CS030 B-trees (1972)
- [ ] Bayer and McCreight were at Boeing Scientific Research Laboratories
- [ ] B+ trees keep all records in the leaves and are what most databases actually use
- [ ] E057 (relational model to B-trees) and E065 (B-trees to System R) are interpretive

### CS031 Karp's 21 problems (1973)
- [ ] Karp's paper dates from 1972 (proceedings of the 1972 symposium); the CSV lists 1973
- [ ] The paper lists 21 problems; the diagram shows only a sample of the reductions
- [ ] Karp received the 1985 Turing Award; Garey and Johnson's book appeared in 1979
- [ ] E060 (Cook to Karp) is tagged explicit: Karp's paper begins from Cook's theorem

### CS032 TCP/IP (1974)
- [ ] ARPANET switched to TCP/IP on 1 January 1983 ('flag day'); the split into TCP and IP was in 1978
- [ ] Van Jacobson's congestion control (1988) followed the 1986 collapses
- [ ] Cerf and Kahn: Turing Award 2004
- [ ] E066 (ARPANET to Cerf-Kahn) is tagged explicit: the paper discusses the ARPANET; verify before relying on it
- [ ] E067 and E068 (to End-to-end and to the Web proposal) are interpretive

### CS033 UNIX (1974)
- [ ] The system was rewritten in C in 1973; the pipe was added in 1973 on McIlroy's proposal
- [ ] Bell Labs withdrew from the Multics project in 1969
- [ ] The paper acknowledges Multics as a source of ideas such as the hierarchical file system and the shell as an ordinary program (basis for E069, tagged explicit)
- [ ] E054 (THE to UNIX) is interpretive
- [ ] Berkeley's version carried the first widely used TCP/IP implementation

### CS034 Mythical Man-Month (1975)
- [ ] Brooks managed OS/360 development at IBM; Turing Award 1999; anniversary edition 1995
- [ ] Communication paths grow as n(n-1)/2 for a team of n
- [ ] In the 1995 edition Brooks revised his advice to plan to throw one away in favour of incremental development
- [ ] The chart is schematic, not data; E053 (NATO conference to Brooks) and E081 (to No Silver Bullet) are interpretive

### CS035 Protection principles (1975)
- [ ] The eight principles as listed in the paper's design principles section
- [ ] Saltzer and Schroeder drew on their Multics experience (basis for ghost G009 and edge E071, tagged explicit)
- [ ] The paper appeared in Proceedings of the IEEE, 1975

### CS036 Symbols and search (1976)
- [ ] Newell and Simon received the 1975 Turing Award; the lecture was published in 1976; Simon won the 1978 Nobel Prize in economics
- [ ] The two named hypotheses are the Physical Symbol System Hypothesis and the Heuristic Search Hypothesis
- [ ] E078 and E079 (Dartmouth and LISP into the lecture) are interpretive; E080 (to backpropagation) is a rival-approach edge, interpretive

### CS037 Diffie-Hellman (1976)
- [ ] Diffie-Hellman Turing Award 2015; the paper also credits Merkle's work on puzzles
- [ ] GCHQ researchers (Ellis, Cocks, Williamson) discovered similar ideas earlier in secret, declassified in 1997 (not mentioned in the text)
- [ ] E061 (Cook to Diffie-Hellman) and E076 (Shannon to Diffie-Hellman) are interpretive; E075 (to RSA) is tagged explicit
- [ ] The paint-mixing picture is a standard analogy, not the paper's own

### CS038 Smalltalk (1976)
- [ ] Smalltalk-72 manual edited by Goldberg and Kay (Xerox PARC, 1976); Kay: Turing Award 2003
- [ ] Kay's credit to Simula, LISP, Sketchpad and Logo as influences comes from his own later accounts (basis for E072, E073, E035; all interpretive)
- [ ] Steve Jobs's 1979 visit to Xerox PARC
- [ ] E074 (Smalltalk to Design Patterns) is tagged explicit: the book draws on Smalltalk and MVC; verify

### CS039 Entity-relationship (1976)
- [ ] Chen's paper appeared in ACM Transactions on Database Systems, 1976
- [ ] Chen discusses the relational and network models and cites Codd (basis for E058, tagged explicit)
- [ ] Influence on UML class diagrams is a common account, not a claim from Chen's paper

### CS040 RSA (1978)
- [ ] The worked example (p=61, q=53, e=17, d=2753, m=65, c=2790) is the standard textbook example and was computed and checked, not taken from the paper
- [ ] Rivest, Shamir and Adleman: Turing Award 2002; RSA Security was founded in 1982
- [ ] GCHQ's Clifford Cocks found an equivalent scheme earlier in secret (declassified 1997)
- [ ] E075 (Diffie-Hellman to RSA) is tagged explicit: the RSA paper cites 'New Directions'

### CS041 The C language (1978)
- [ ] C descends from BCPL and B; the language was designed for UNIX (basis for E070, tagged explicit)
- [ ] The 1978 book's first example prints 'hello, world'
- [ ] ANSI C was standardised in 1989
- [ ] E086 (ALGOL 60 to C) is interpretive: C's block structure and control flow descend from ALGOL through BCPL and B

### CS042 Logical clocks (1978)
- [ ] Lamport: Turing Award 2013
- [ ] The 1978 paper's state-machine idea underlies Paxos and Raft; the Paxos paper cites it (E083 is tagged interpretive until checked)
- [ ] Vector clocks were developed by Fidge and Mattern (1988) as a refinement
- [ ] E055 (THE to Lamport, new domain), E082, E083 and E084 are interpretive

### CS043 System R optimizer (1979)
- [ ] System R was IBM Research's relational prototype at San Jose; the paper is by Selinger, Astrahan, Chamberlin, Lorie and Price
- [ ] Dynamic programming over join orders and 'interesting orders' are the paper's key ideas
- [ ] The costs in the diagram are illustrative
- [ ] E059 (Codd to System R) is tagged explicit; E065 (B-trees to System R) and E085 (to shared nothing) are interpretive

## E. Facts stated in the text that are worth a quick check

- [ ] **CS001**: Russell found his paradox in 1901; Principia has three volumes (1910-1913); the Logic Theorist (1956) proved theorems from its chapter 2
- [ ] **CS002**: Gödel numbering; primitive recursive functions are used in the 1931 paper; the second theorem concerns a system proving its own consistency
- [ ] **CS003**: Lambda-definable functions coincide with Gödel-Herbrand general recursive functions
- [ ] **CS005**: Shannon wrote the work as an MIT master's student (thesis 1937, paper 1938)
- [ ] **CS006**: Neurons with excitatory and inhibitory inputs and a threshold; networks with a tape are equivalent to Turing machines
- [ ] **CS007**: Manchester Baby ran a stored program in 1948; EDSAC entered service in 1949
- [ ] **CS008**: Entropy of a heavily biased coin is less than one bit; source-coding and channel-coding theorems
- [ ] **CS009**: Turing predicted by about 2000 an average interrogator would have no more than a 70% chance of identification after five minutes
- [ ] **CS010**: Four proposers (McCarthy, Minsky, Rochester, Shannon); Rockefeller Foundation; two-month summer study in 1956; Newell and Simon presented the Logic Theorist
- [ ] **CS012**: Delivered for the IBM 704 in 1957; compiler optimisation was a central effort
- [ ] **CS013**: The paper is three pages and treats two problems (shortest path and minimum spanning tree); OSPF uses shortest-path-first
- [ ] **CS014**: Garbage collection and the eval function are in the 1960 paper; primitives car, cdr, cons, atom, eq; IPL preceded LISP
- [ ] **CS015**: H-LAM/T (Humans using Language, Artifacts, Methodology, Training); the 1968 demonstration featured a mouse, windows, hypertext, shared-screen collaboration and video conferencing
- [ ] **CS016**: Hoare worked on machine translation when he devised it; worst case is quadratic; the paper presents the method in ALGOL; introsort is the usual guard against the worst case
- [ ] **CS017**: Sketchpad ran on the TX-2 with a light pen; constraints and master/instance drawings; Kay credits it as an influence
- [ ] **CS018**: Direct DFT is about n squared operations; Gauss used the idea around 1805; seismic test-ban monitoring as a motivation; 1,048,576 versus 10,240 steps for n = 1,024
- [ ] **CS019**: 1965 forecast of yearly doubling, revised to every two years in 1975; Dennard scaling ended in the mid-2000s
- [ ] **CS020**: Hartmanis and Stearns at General Electric; time hierarchy theorem; Turing Award 1993
- [ ] **CS021**: 1967 AFIPS conference; with 95 per cent parallel work, 1,000 processors give about 19.6 times; Gustafson 1988
- [ ] **CS022**: Two-page CACM letter (March 1968); Wirth chose the title; Knuth 1974 on goto; Dijkstra's own wording about programmer quality and goto density
- [ ] **CS023**: Garmisch, Germany, October 1968; NATO Science Committee; edited by Naur and Randell; McIlroy on mass-produced components; Rome conference 1969
- [ ] **CS024**: Volumes 1 (1968), 2 (1969), 3 (1973), 4A (2011); MIX machine; 1974 Turing Award; TeX prompted by the second edition of Volume 2
- [ ] **CS025**: Eindhoven (Technische Hogeschool Eindhoven); six levels, 0 to 5; semaphores with P and V operations
- [ ] **CS026**: Triple {P} S {Q}; assignment axiom by substitution; loop invariants; Floyd 1967 preceded it; partial correctness only
- [ ] **CS027**: Codd at IBM; data independence; normalisation; Turing Award 1981; SQL grew from IBM's SEQUEL
- [ ] **CS028**: SAT is NP-complete; Cook's paper uses P-reducibility, the names NP and NP-complete came afterwards; Turing Award 1982
- [ ] **CS029**: Keyword-in-context example; two decompositions compared; information hiding
- [ ] **CS030**: Bayer and McCreight at Boeing; every leaf at the same depth, nodes at least half full; split on overflow
- [ ] **CS031**: 21 problems; Garey and Johnson 1979; Turing Award 1985; year 1972 versus the CSV's 1973
- [ ] **CS032**: Datagrams, gateways, acknowledgements and windows; TCP split into TCP and IP in 1978; ARPANET moved to TCP/IP on 1 January 1983; Turing Award 2004; congestion collapse 1986 and Jacobson 1988
- [ ] **CS033**: Rewritten in C in 1973; pipes in 1973; Bell Labs left Multics in 1969; Turing Award 1983; Berkeley's TCP/IP implementation
- [ ] **CS034**: OS/360; communication paths n(n-1)/2; Brooks's law; conceptual integrity; second-system effect; 1995 anniversary edition; Turing Award 1999
- [ ] **CS035**: The eight principles and their names; descriptors, access control lists and capabilities
- [ ] **CS036**: Two hypotheses (physical symbol system, heuristic search); Turing Award 1975 and Simon's 1978 Nobel Prize
- [ ] **CS037**: Public-key and digital signature ideas; Diffie-Hellman key exchange by modular exponentiation; Turing Award 2015
- [ ] **CS038**: Dynabook; Alto at Xerox PARC; Smalltalk-72 objects parse their own messages; Turing Award 2003; Jobs's 1979 PARC visit
- [ ] **CS039**: Entities, relationships and attributes; cardinalities; published in ACM TODS 1976
- [ ] **CS040**: Worked example p=61, q=53, n=3233, e=17, d=2753, m=65 gives c=2790 (computed, not from the paper); Turing Award 2002; RSA Security founded 1982
- [ ] **CS041**: Designed for UNIX; descends from BCPL and B; the 1978 book's first program prints hello, world; ANSI C 1989
- [ ] **CS042**: Happened-before relation; logical clocks; state machine replication; Turing Award 2013; vector clocks 1988
- [ ] **CS043**: System R optimizer by Selinger and colleagues; dynamic programming over join orders; interesting orders
