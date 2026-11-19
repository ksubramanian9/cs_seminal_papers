# Candidate additions to the corpus

Audit of what the 79-paper CSV leaves out. **Written from my own knowledge, not checked against a source.** Years, authors and titles need verifying before anything goes into the CSV, the same way the review queue works.

## How the tiers were decided

- **A**: near-universal. A Turing Award citation, a standard textbook chapter, or a missing link: without it the chain between two papers already in the corpus has a visible hole.
- **B**: strong. Widely taught or cited as the origin of a major idea, but a reasonable curator could leave it out.
- **C**: defensible. Influential in its subfield; include only if you want depth there.

Items marked **(ghost)** are already ghost nodes (G001–G020). Promoting one to a full paper frees a ghost slot and gives it its own explanation.
Items marked **(asked)** are the ones you named.

Existing IDs in the "Links" column are the papers it would connect to.

## Where the current list is thin

1. **Concurrency and operating systems.** Only THE (CS025) and UNIX (CS033). No semaphores, monitors, virtual memory, virtualization, real-time scheduling.
2. **Transactions and database internals.** Codd, Selinger, B-trees, ER, then nothing until the Google-era systems. No SQL, ACID, ARIES, LSM trees.
3. **Types, semantics and verification.** One verification paper (Hoare, CS026) and model checking (CS044). No type theory, no denotational semantics, no concurrency calculi.
4. **Quantum computing.** The whole field is absent.
5. **Cryptography theory.** RSA and Diffie–Hellman are there; secrecy theory, zero-knowledge, homomorphic encryption are not.
6. **Networking.** TCP (CS032), end-to-end (CS046), nothing on packet switching, Ethernet, congestion control, DNS, RPC.
7. **Distributed-systems theory.** Paxos, Raft and Byzantine generals are present, but the impossibility result they all answer (FLP) is not.
8. **Machine learning breadth.** Neural nets after 2012 are covered; probabilistic models, boosting, RL milestones, word embeddings, diffusion, scaling laws, RLHF are not.
9. **Absent subfields:** graphics, vision/NLP/speech as fields, numerical and scientific computing, bioinformatics, AI ethics and fairness.
10. **Before 1956.** Only 11 entries, and none for coding theory, compression or the first compilers.

## Foundations, theory, algorithms

| Tier | Year | Work | Why / links |
|---|---|---|---|
| A | 1959 | Rabin & Scott, *Finite Automata and Their Decision Problems* | The automata half of CS011 Chomsky and CS006 McCulloch–Pitts. |
| A | 1984 | Valiant, *A Theory of the Learnable* | Gives learning a complexity theory. CS055 SVM, CS056, CS068 all sit on it. |
| A | 1985 | Goldwasser, Micali, Rackoff, *The Knowledge Complexity of Interactive Proof Systems* | Zero-knowledge. Links CS028 Cook, CS037 DH, CS067 Bitcoin (later zk systems). |
| A | 1965 | Edmonds, *Paths, Trees, and Flowers* | Where "polynomial time = efficient" is first argued. Precedes CS028 Cook and CS031 Karp. |
| B | 1973 | Levin, *Universal Sequential Search Problems* | Independent NP-completeness; completes the Cook–Levin pair. |
| B | 1965 | Kolmogorov, *Three Approaches to the Quantitative Definition of Information* (with Solomonoff 1964, Chaitin 1966) | Algorithmic information. Links CS008 Shannon and CS004 Turing. |
| B | 1969 | Strassen, *Gaussian Elimination Is Not Optimal* | Showed a "obvious" bound could be beaten. Links CS020 Hartmanis, CS018 FFT. |
| B | 1972 | Tarjan, *Depth-First Search and Linear Graph Algorithms* | Linear-time graph algorithms. Links CS013 Dijkstra. |
| B | 1956 | Ford & Fulkerson, *Maximal Flow Through a Network* | Max-flow/min-cut; the basis of combinatorial optimisation. Links CS013, CS031 Karp. |
| B | 1970 | Bloom, *Space/Time Trade-offs in Hash Coding with Allowable Errors* | Probabilistic data structures; used inside CS064 Bigtable. |
| B | 1982 | Yao, *Protocols for Secure Computations* | Secure multiparty computation. Links CS065. |
| B | 1953 | Metropolis et al., *Equation of State Calculations by Fast Computing Machines* | Monte Carlo / MCMC, the sampling idea behind later probabilistic ML. Links CS007. |
| B | 1965 | Knuth, *On the Translation of Languages from Left to Right* | LR parsing; the working form of CS011 Chomsky's grammars. |
| C | 1977 | Carter & Wegman universal hashing; AVL trees (1962); KMP (1977); Karmarkar (1984); Khachiyan (1979); Arora–Safra / ALMSS PCP theorem (1992); Baker–Gill–Solovay (1975); Razborov–Rudich (1994); Kuhn Hungarian (1955); Dantzig simplex (1947) | Subfield depth. |

## Information theory, coding, compression

| Tier | Year | Work | Why / links |
|---|---|---|---|
| A | 1949 | Shannon, *Communication Theory of Secrecy Systems* | Founds modern cryptography. Between CS008 and CS037. |
| A | 1950 | Hamming, *Error Detecting and Error Correcting Codes* | Coding theory. Follows CS008. |
| A | 1952 | Huffman, *A Method for the Construction of Minimum-Redundancy Codes* | First optimal compression. Follows CS008. |
| A | 1977 | Ziv & Lempel, *A Universal Algorithm for Sequential Data Compression* | Dictionary compression (ZIP, PNG, gzip). |
| C | 1960 | Reed–Solomon codes; Viterbi (1967); Kalman filter (1960) | Subfield depth. |

## Quantum computing (absent field)

| Tier | Year | Work | Why / links |
|---|---|---|---|
| A | 1982 | Feynman, *Simulating Physics with Computers* | The motivating idea. Challenges CS004 Turing's model. |
| A | 1994 | Shor, *Algorithms for Quantum Computation: Discrete Logarithms and Factoring* | Threatens CS040 RSA and CS037 DH. |
| B | 1985 | Deutsch, *Quantum Theory, the Church–Turing Principle and the Universal Quantum Computer* | Links CS003, CS004. |
| B | 1996 | Grover, *A Fast Quantum Mechanical Algorithm for Database Search* | Second canonical speed-up. |
| B | 1984 | Bennett & Brassard (BB84) | Quantum key distribution. Links CS037. |
| C | 2019 | Arute et al., *Quantum Supremacy Using a Programmable Superconducting Processor* | Emerging milestone. |

## AI and machine learning

| Tier | Year | Work | Why / links |
|---|---|---|---|
| A | 1958 | Rosenblatt, *The Perceptron* **(ghost G013)** | Promote: CS006 → perceptron → CS048. |
| A | 1956 | Newell, Shaw, Simon, *The Logic Theory Machine* | First AI program; precedes CS010, CS036. |
| A | 1959 | Samuel, *Some Studies in Machine Learning Using the Game of Checkers* | First learning program. Links CS056 RL. |
| A | 1969 | Minsky & Papert, *Perceptrons* | The critique that stalled neural nets until CS048. |
| A | 1982 | Hopfield, *Neural Networks and Physical Systems with Emergent Collective Computational Abilities* | Revival of neural nets; 2024 Nobel Prize in Physics. |
| A | 1988 | Pearl, *Probabilistic Reasoning in Intelligent Systems* | Bayesian networks; the other paradigm beside CS048. |
| A | 1997 | Hochreiter & Schmidhuber, *Long Short-Term Memory* **(ghost G019)** | Promote: precedes CS075. |
| A | 1998 | LeCun et al., *Gradient-Based Learning Applied to Document Recognition* **(ghost G018)** | Promote: precedes CS068. |
| A | 2014 | Bahdanau, Cho, Bengio, *Neural Machine Translation by Jointly Learning to Align and Translate* **(ghost G020)** | Promote: attention itself, directly before CS075. |
| A | 2013 | Mikolov et al., *Efficient Estimation of Word Representations in Vector Space* (word2vec) | Embeddings; precedes CS076 BERT. |
| A | 2015 | Mnih et al., *Human-level Control through Deep Reinforcement Learning* | Joins CS056 and CS068. |
| A | 2016 | Silver et al., *Mastering the Game of Go with Deep Neural Networks and Tree Search* | AlphaGo. |
| A | 2020 | Ho, Jain, Abbeel, *Denoising Diffusion Probabilistic Models* | Diffusion; rival to CS070 GAN. |
| A | 2020 | Kaplan et al., *Scaling Laws for Neural Language Models* | Why CS077 happened. |
| A | 2022 | Ouyang et al., *Training Language Models to Follow Instructions with Human Feedback* (InstructGPT) | RLHF; the step from CS077 to chat assistants. |
| A | 2021 | Jumper et al., *Highly Accurate Protein Structure Prediction with AlphaFold* | AI beyond language and images. |
| B | 1985 | Ackley, Hinton, Sejnowski, *A Learning Algorithm for Boltzmann Machines* | Links CS048. |
| B | 1977 | Dempster, Laird, Rubin, *Maximum Likelihood from Incomplete Data via the EM Algorithm* | Latent-variable learning. |
| B | 1997 | Freund & Schapire, *A Decision-Theoretic Generalization of On-line Learning* (AdaBoost) | Boosting. Rival to CS055. |
| B | 2001 | Breiman, *Random Forests* | Still the baseline for tabular data. |
| B | 1986 | Quinlan, *Induction of Decision Trees* | Symbolic learning. |
| B | 1988 | Sutton, *Learning to Predict by the Methods of Temporal Differences* | Core of CS056. |
| B | 2006 | Hinton, Osindero, Teh, *A Fast Learning Algorithm for Deep Belief Nets* | Restarted deep learning before CS068. |
| B | 2003 | Bengio et al., *A Neural Probabilistic Language Model* | Neural language models; before CS077. |
| B | 2013 | Kingma & Welling, *Auto-Encoding Variational Bayes* | VAE; rival to CS070. |
| B | 2014 | Kingma & Ba, *Adam* | The default optimiser. |
| B | 2020 | Dosovitskiy et al., *An Image Is Worth 16×16 Words* (ViT) | Transformer takes vision from CS068/CS072. |
| B | 2021 | Radford et al., *Learning Transferable Visual Models from Natural Language Supervision* (CLIP) | Links vision and language. |
| B | 2018–19 | Radford et al., GPT-1 / GPT-2 | Directly between CS075 and CS077. |
| B | 2022 | Hoffmann et al., *Training Compute-Optimal Large Language Models* (Chinchilla) | Corrects CS077/Kaplan. |
| B | 2017 | Christiano et al., *Deep Reinforcement Learning from Human Preferences* | Origin of RLHF. |
| B | 2022 | Wei et al., *Chain-of-Thought Prompting* | Reasoning in prompts. |
| B | 1966 | Weizenbaum, *ELIZA* | First conversational program. |
| B | 1976 | Shortliffe, *MYCIN* | Expert systems era. |
| B | 1982 | Marr, *Vision* | Computational theory of vision. |
| B | 1950 | Shannon, *Programming a Computer for Playing Chess* | Games as AI testbed; precedes CS070. |
| B | 2018 | Buolamwini & Gebru, *Gender Shades* | Fairness. |
| B | 2021 | Bender et al., *On the Dangers of Stochastic Parrots* | Critique of CS077-era scaling. |
| C | | Winograd SHRDLU (1971); DENDRAL (1969); Viola–Jones (2001); SIFT (2004); Canny (1986); Hubel–Wiesel (1962); Dropout (2014); BatchNorm (2015); Sohl-Dickstein diffusion (2015); AlphaGo Zero (2017); PPO (2017); XGBoost (2016); distillation (2015); T5 (2019); LLaMA (2023); ReAct (2022); Constitutional AI (2022); Concrete Problems in AI Safety (2016); CTC (2006); IBM statistical MT (1990); Fairness Through Awareness (2012); DeepSeek-R1 (2025) | Depth and emerging items. |

## Programming languages, semantics, verification

| Tier | Year | Work | Why / links |
|---|---|---|---|
| A | 1960 | Backus, Naur et al., *Report on the Algorithmic Language ALGOL 60* **(ghost G007)** | Promote: BNF and block structure; ancestor of CS041, CS038, CS053. |
| A | 1967 | Simula 67 (Dahl, Nygaard) **(ghost G011)** | Promote: first object-oriented language; precedes CS038. |
| A | 1966 | Landin, *The Next 700 Programming Languages* | Languages as lambda-calculus variants. Links CS003, CS014. |
| A | 1967 | Floyd, *Assigning Meanings to Programs* | The other half of CS026. |
| A | 1978 | Milner, *A Theory of Type Polymorphism in Programming* | Hindley–Milner types, ML. |
| A | 1978 | Hoare, *Communicating Sequential Processes* | Concurrency model; precedes Go, Erlang. |
| A | 1977 | Pnueli, *The Temporal Logic of Programs* **(ghost G015)** | Promote: precedes CS044. |
| B | 1966 | Böhm & Jacopini, *Flow Diagrams, Turing Machines and Languages with Only Two Formation Rules* | The theorem under CS022. |
| B | 1970 | Dijkstra, *Notes on Structured Programming* | Follows CS022. |
| B | 1971 | Wirth, *Program Development by Stepwise Refinement*; Pascal | Teaching language, follows CS022. |
| B | 1971 | Scott & Strachey, *Toward a Mathematical Semantics for Computer Languages* | Denotational semantics. |
| B | 1973 | Hewitt, Bishop, Steiger, *A Universal Modular ACTOR Formalism* | Actors; precedes Erlang. |
| B | 1972–74 | Colmerauer (Prolog); Kowalski, *Predicate Logic as Programming Language* | Logic programming; rival to CS014. |
| B | 1975–78 | Steele & Sussman, *Scheme / the Lambda Papers* | Leads to CS047 SICP. |
| B | 1980 | Milner, *A Calculus of Communicating Systems* | Rival to Hoare's CSP (above). |
| B | 1977 | Cousot & Cousot, *Abstract Interpretation* | Static analysis foundation. |
| B | 1985 | Stroustrup, *The C++ Programming Language* | CS041 plus CS038 meet; precedes Java. |
| B | 1995 | Gosling & McGilton, *The Java Language Environment*; Java Language Specification (1996) **(asked)** | Bytecode + VM + GC for mainstream; "write once run anywhere". See note below. |
| B | 1990–92 | Wadler, *Comprehending Monads* / *The Essence of Functional Programming* | Monads; Haskell (Hudak et al., 1990). |
| B | 1991 | Cytron et al., *Efficiently Computing Static Single Assignment Form* | Modern compiler IR. |
| B | 2004 | Lattner & Adve, *LLVM* | Modern compiler infrastructure. |
| B | 1988 | Meyer, *Object-Oriented Software Construction* (design by contract) | Follows CS026, CS053. |
| B | 1974–77 | Liskov & Zilles, *Programming with Abstract Data Types*; CLU | Precedes CS053. |
| B | 1978 | Backus, *Can Programming Be Liberated from the von Neumann Style?* | Challenges CS007. |
| B | 1952 | Hopper, *The Education of a Computer* | First compiler idea; precedes CS012. |
| B | 1967 | Strachey, *Fundamental Concepts in Programming Languages* | Naming and values. |
| B | 1984 | Martin-Löf, *Intuitionistic Type Theory* | Proofs as programs. |
| B | 2003 | Armstrong, *Making Reliable Distributed Systems in the Presence of Software Errors* (Erlang) | Fault tolerance in the language. |
| B | 2009 | Leroy, *Formal Verification of a Realistic Compiler* (CompCert); Klein et al., seL4 | Verification at scale. |
| B | 1984 | Knuth, *Literate Programming* | Follows CS024. |
| C | | Reynolds, *Definitional Interpreters* (1972); Girard/Reynolds System F (1972–74); Dijkstra guarded commands (1975); Hoare, *Hints on Programming Language Design* (1973); Wadler, *Theorems for Free* (1989); Pierce, TAPL (2002); Moggi monads (1991); Jung RustBelt (2018); Ungar & Smith Self (1987); Kildall (1973); Aho/Ullman Dragon Book (1977); Johnson YACC (1975); Miller fuzz study (1990); QuickCheck (2000); King symbolic execution (1976) | Depth. |

## Software engineering

| Tier | Year | Work | Why / links |
|---|---|---|---|
| A | 1968 | Conway, *How Do Committees Invent?* | Conway's law. Links CS029 Parnas, CS034 Brooks. |
| B | 1970 | Royce, *Managing the Development of Large Software Systems* | Waterfall; the thing CS059/CS060 react to. |
| B | 1981 | Boehm, *Software Engineering Economics* (spiral model 1988) | Cost of change; CS059 argues against it. |
| B | 1976 | Fagan, *Design and Code Inspections to Reduce Errors* | Peer review. |
| B | 1980 | Lehman, *Programs, Life Cycles, and Laws of Software Evolution* | Evolution of software; follows CS034. |
| B | 1999 | Raymond, *The Cathedral and the Bazaar* | Open-source development. Rival to CS034. |
| B | 1985 | Stallman, *The GNU Manifesto* | Free software. |
| B | 1999 | Fowler, *Refactoring* | Follows CS059. |
| B | 2002 | Beck, *Test-Driven Development: By Example* **(asked)** | Tests-first as a discipline in its own right. Partly covered inside CS059; separate entry is defensible. |
| B | 2003 | Evans, *Domain-Driven Design* **(asked)** | Software modelled on the business domain. Links CS054, CS029. |
| B | 2010 | Humble & Farley, *Continuous Delivery* | Follows CS059/CS074. |
| B | 1996 | Shaw & Garlan, *Software Architecture* (Perry & Wolf 1992) | Architecture as a discipline. |
| B | 2013 | Dean & Barroso, *The Tail at Scale* | Follows CS063, CS074. |
| B | 1993 | Leveson & Turner, *An Investigation of the Therac-25 Accidents* | Safety-critical software. |
| C | | Weinberg, Psychology of Computer Programming (1971); Cunningham technical debt (1992); Parnas, Software Aging (1994); Kiczales AOP (1997); Wirth, *A Plea for Lean Software* (1995); Basiri chaos engineering (2016); Forsgren, Accelerate (2018); Karpathy Software 2.0 (2017); Peng Copilot productivity (2023) | Depth. |

## Operating systems and concurrency

| Tier | Year | Work | Why / links |
|---|---|---|---|
| A | 1965 | Dijkstra, *Cooperating Sequential Processes* (semaphores; with *Solution of a Problem in Concurrent Programming Control*) | The basis of CS025 and everything concurrent. |
| A | 1984 | Thompson, *Reflections on Trusting Trust* | Security of toolchains. Follows CS033, CS041. |
| B | 1962 | Corbató et al., *An Experimental Time-Sharing System* (CTSS) | Before CS033, ghost Multics (G009). |
| B | 1968 | Denning, *The Working Set Model for Program Behavior* | Virtual memory. Follows CS025. |
| B | 1974 | Hoare, *Monitors* | Structured synchronisation. |
| B | 1974 | Popek & Goldberg, *Formal Requirements for Virtualizable Third Generation Architectures* | Virtualization; precedes cloud (CS073). |
| B | 1973 | Liu & Layland, *Scheduling Algorithms for Multiprogramming in a Hard-Real-Time Environment* | Real-time scheduling. |
| B | 1983 | Lampson, *Hints for Computer System Design* | System design. Follows CS046. |
| B | 1979 | Lamport, *How to Make a Multiprocessor Computer That Correctly Executes Multiprocess Programs* | Sequential consistency; follows CS042. |
| B | 1990–91 | Herlihy & Wing (linearizability); Herlihy, *Wait-Free Synchronization* | Correctness of concurrent objects. |
| B | 1992 | Rosenblum & Ousterhout, *Design and Implementation of a Log-Structured File System* | Ancestor of LSM and CS062. |
| B | 1988 | Patterson, Gibson, Katz, *A Case for Redundant Arrays of Inexpensive Disks* (RAID) | Storage reliability; precedes CS062. |
| B | 2012 | Zaharia et al., *Resilient Distributed Datasets* (Spark) | Follows CS063. |
| B | 2006 | Burrows, *The Chubby Lock Service* | Coordination service. |
| B | 2018 | Kocher et al., *Spectre Attacks*; Lipp et al., *Meltdown* | Speculation as a security flaw. Follows CS052. |
| C | | Mach (1986); exokernel (1995); L4 (1995); Xen (2003); Bell–LaPadula (1973); Lampson confinement (1973); ZooKeeper (2010); Torvalds Linux announcement (1991) | Depth. |

## Computer architecture

| Tier | Year | Work | Why / links |
|---|---|---|---|
| B | 1951 | Wilkes, *The Best Way to Design an Automatic Calculating Machine* | Microprogramming; follows CS007. |
| B | 1980 | Patterson & Ditzel, *The Case for the Reduced Instruction Set Computer* | Context for CS052. |
| B | 1966 | Flynn, *Very High-Speed Computing Systems* | Taxonomy of parallelism; precedes CS021. |
| B | 1967 | Tomasulo, *An Efficient Algorithm for Exploiting Multiple Arithmetic Units* | Out-of-order execution. |
| B | 1974 | Dennard et al., *Design of Ion-Implanted MOSFETs* | Why CS019 held. |
| B | 2017 | Jouppi et al., *In-Datacenter Performance Analysis of a TPU* | Hardware for CS068/CS075. |
| B | 2009 | Barroso & Hölzle, *The Datacenter as a Computer* | Context for CS062/CS073. |
| C | | Wulf & McKee memory wall (1995); Mead & Conway (1980); Goldberg floating-point (1991); Hennessy & Patterson *Golden Age* (2019); Lovelace notes (1843, pre-1900) | Depth. |

## Databases and data

| Tier | Year | Work | Why / links |
|---|---|---|---|
| A | 1974 | Chamberlin & Boyce, *SEQUEL: A Structured English Query Language* | SQL. Follows CS027. |
| A | 1981 | Gray, *The Transaction Concept: Virtues and Limitations* | Basis of every database. |
| A | 1992 | Mohan et al., *ARIES* | Recovery. Follows CS030. |
| B | 1976 | Gray et al., *Granularity of Locks and Degrees of Consistency* | Isolation. |
| B | 1983 | Härder & Reuter, *Principles of Transaction-Oriented Database Recovery* | ACID named. |
| B | 1976 | Stonebraker et al., *The Design and Implementation of INGRES* | Rival to System R (CS043). |
| B | 2005 | Stonebraker et al., *C-Store* (and *One Size Fits All*) | Column stores; follows CS064. |
| B | 1996 | O'Neil et al., *The Log-Structured Merge-Tree* | Inside CS064, CS066. |
| C | | Kung & Robinson optimistic concurrency (1981); Berenson ANSI isolation critique (1995); Guttman R-trees (1984); Agrawal Apriori (1994); Gray data cube (1997); Bernstein & Goodman (1981); Melnik Dremel (2010); Kreps Kafka (2011) | Depth. |

## Networks and distributed systems

| Tier | Year | Work | Why / links |
|---|---|---|---|
| A | 1964 | Baran, *On Distributed Communications Networks* (with Kleinrock 1961, Davies) | Packet switching. Precedes ghost ARPANET (G012), CS032. |
| A | 1985 | Fischer, Lynch, Paterson, *Impossibility of Distributed Consensus with One Faulty Process* | FLP. The result CS045, CS058, CS071 all work around. |
| A | 1988 | Jacobson, *Congestion Avoidance and Control* | Makes CS032 work at scale. |
| A | 1976 | Metcalfe & Boggs, *Ethernet* | Local networks. |
| A | 1999 | Castro & Liskov, *Practical Byzantine Fault Tolerance* | CS045 made practical. |
| B | 1984 | Birrell & Nelson, *Implementing Remote Procedure Calls* | RPC. |
| B | 1983–87 | Mockapetris, DNS (RFC 882/883, 1034/1035) | Naming. |
| B | 1981 | Postel, TCP and IP (RFC 791/793) | The standards. |
| B | 1988 | Clark, *The Design Philosophy of the DARPA Internet Protocols* | Follows CS046. |
| B | 1985 | Chandy & Lamport, *Distributed Snapshots* | Follows CS042. |
| B | 1990 | Schneider, *Implementing Fault-Tolerant Services Using the State Machine Approach* | Replication. |
| B | 1988 | Dwork, Lynch, Stockmeyer, *Consensus in the Presence of Partial Synchrony* | Frames CS058. |
| B | 2000 | Fielding, *Architectural Styles and the Design of Network-based Software Architectures* (REST) | The web's architecture. Follows CS051. |
| B | 2001 | Stoica et al., *Chord* | Distributed hash tables; ancestor of CS066. |
| B | 2011 | Shapiro et al., *Conflict-Free Replicated Data Types* | Follows CS066. |
| C | | Oki & Liskov Viewstamped Replication (1988); Chandra & Toueg failure detectors (1996); BGP (1989); Cohen BitTorrent (2003); Fox & Brewer (1997); Roberts (1967) | Depth. |

## HCI, the web, graphics

| Tier | Year | Work | Why / links |
|---|---|---|---|
| A | 1945 | Bush, *As We May Think* **(ghost G006)** | Promote: precedes CS015, CS051. |
| A | 1960 | Licklider, *Man-Computer Symbiosis* | The vision behind CS015. |
| A | 1991 | Weiser, *The Computer for the 21st Century* | Ubiquitous computing. |
| B | 1972 | Kay, *A Personal Computer for Children of All Ages* | Dynabook. Follows CS038. |
| B | 1954 | Fitts, *The Information Capacity of the Human Motor System* | First law of HCI. |
| B | 1983 | Shneiderman, *Direct Manipulation*; Card, Moran & Newell, *The Psychology of Human–Computer Interaction* | Follows CS017. |
| B | 1999 | Kleinberg, *Authoritative Sources in a Hyperlinked Environment* (HITS) | Rival to CS057. |
| B | 1968 | Engelbart & English, *A Research Center for Augmenting Human Intellect* ("mother of all demos") | Follows CS015. |
| B | 1980 | Whitted, *An Improved Illumination Model for Shaded Display* | Ray tracing. Graphics field. |
| B | 1986 | Kajiya, *The Rendering Equation* | Graphics field. |
| B | 1974 | Catmull, thesis (z-buffer) | Graphics field; follows CS017. |
| B | 2020 | Mildenhall et al., *NeRF* | Neural graphics. |
| C | | Nelson, *Computer Lib* (1974); Alto (1979); Norman (1988); Ishii & Ullmer (1997); von Ahn CAPTCHA (2003); Semantic Web (2001); Phong (1975); Bresenham (1965); Kerbl Gaussian splatting (2023) | Depth. |

## Security and cryptography

| Tier | Year | Work | Why / links |
|---|---|---|---|
| B | 1977 | NBS, *Data Encryption Standard*; Daemen & Rijmen, *Rijndael/AES* (2000) | Symmetric encryption standards. |
| B | 1978 | Needham & Schroeder, *Using Encryption for Authentication in Large Networks* | Authentication protocols. |
| B | 1981 | Chaum, *Untraceable Electronic Mail, Return Addresses, and Digital Pseudonyms* | Mixnets; precedes CS067. |
| B | 1984 | Goldwasser & Micali, *Probabilistic Encryption* | Semantic security. |
| B | 1985 | Miller; Koblitz (elliptic-curve cryptography) | ECC used in CS067. |
| B | 2009 | Gentry, *Fully Homomorphic Encryption Using Ideal Lattices* | Compute on encrypted data. |
| B | 2013 | Buterin, *Ethereum White Paper* | Follows CS067. |
| C | | ElGamal (1985); Spafford on the Morris worm (1989); Tor (2004); SHA-1 collision (2005); Anderson 1972 planning study; Denning lattice model (1976); DP-SGD (2016); k-anonymity (2002); Narayanan & Shmatikov (2008) | Depth. |

## Other gaps

| Tier | Year | Work | Why / links |
|---|---|---|---|
| B | 1936 | Post, *Finite Combinatory Processes — Formulation 1* | Third equivalent model beside CS003, CS004. |
| B | 1956 | von Neumann, *Probabilistic Logics and the Synthesis of Reliable Organisms* (self-reproducing automata, 1966) | Links CS006, CS007. |
| C | | Kleene recursive functions (1936); Rice's theorem (1953); Papert, *Mindstorms* (1980); Wing, *Computational Thinking* (2006); Conway's Game of Life (1970); Needleman–Wunsch (1970); BLAST (1990); Golub & Kahan SVD (1965); Hestenes & Stiefel CG (1952) | Depth. |

## Notes on the three you asked about

- **Java:** the concept (bytecode, VM, GC as mainstream infrastructure) is seminal; the canonical source is weaker than most entries (a white paper and a spec). Rated B because it is an industrial turning point more than a conceptual one. Natural edges: C++ and Smalltalk in, Design Patterns and Spring-era enterprise software out.
- **Test-driven development:** rated B. A separate entry works if you want the progression structural testing → XP → TDD → CI/CD (Continuous Delivery).
- **Domain-driven design:** rated B. Edges: Design Patterns (CS054), Parnas modules (CS029), later microservices.

## Implications of expanding

- Counting A and B, the list roughly doubles (counts per tier are given in the chat summary). Most additions land between 1960 and 2022.
- Every addition needs the same work as M3: a 300–500 word explanation, a diagram, edges with evidence tags, review-queue entries, and a CSV row with the existing columns (including impact ratings and inclusion tier).
- Layout: the 1930–2026 band is 1632 px wide and already stacks to avoid label collisions; roughly doubling the nodes will need either more lanes, a wider axis, or collapsing at low zoom.
- Ghost slots: promoting G006, G007, G011, G013, G015, G018, G019, G020 frees 8 of the 20.
- `intent.md` says the corpus is closed and curated by the CSV; that stays true if the CSV is extended deliberately, but intent.md and the "79" in the success criteria would need updating.
