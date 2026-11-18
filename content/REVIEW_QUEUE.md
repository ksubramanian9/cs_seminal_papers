# Review queue: M2 slice (CS001-CS014)

Claims written from knowledge that you should spot-check against the sources. Tick an item once checked; if it is wrong, say so and I will fix the text and the data. Nothing here has been verified against the original papers.

**How the evidence tags work:** an edge tagged `explicit` asserts the later work cites or credits the earlier one, so it is a checkable fact. An edge tagged `interpretive` is a reading of how ideas connect; read its "why" and decide if you agree.

## A. Content judgement calls (please read these first)

- [ ] **CS011 label changed.** The short label was "Chomsky hierarchy". The 1956 paper compares three models (finite-state, phrase-structure, transformational); the four-level hierarchy was formalised in Chomsky 1959. The label is now "Three models of language", and the text says the hierarchy came in 1959.
- [ ] **CS004 wording.** Turing 1936 proves undecidability for "circle-free" machines; "halting problem" is a later name. The text says "a question closely related to whether it will ever stop".
- [ ] **E014 (Turing to EDVAC) is interpretive on purpose.** The First Draft does not cite Turing and historians debate the direct influence; the "why" says so.
- [ ] **E019 / ghost G005 (Wiener, Cybernetics).** The claim that McCarthy chose "artificial intelligence" partly to distance the field from cybernetics is from his own later recollections. Tagged interpretive.
- [ ] **Ghost nodes added in this slice:** Boole (1854), Frege (1879), Hilbert's decision problem (1928), ENIAC (1945), Wiener (1948). The spec allowed up to three beyond its proposed list; Frege, ENIAC and Wiener are those three. Boole and Hilbert were on the proposed list.
- [ ] **CS007 credit.** The text notes that authorship credit for the First Draft was disputed, without taking a side.

## B. Explicit edges to verify (17)

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

## C. Interpretive edges to read (11)

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
