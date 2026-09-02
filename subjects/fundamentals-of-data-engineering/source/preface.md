# Preface

> Source: *Fundamentals of Data Engineering* by Joe Reis and Matt Housley (O'Reilly).

---

## What This Book Isn’t What This Book Is About
How did this book come about? The origin is deeply rooted in our journey from
data science into data engineering. We often jokingly refer to ourselves as recovering
data scientists. We both had the experience of being assigned to data science projects,
then struggling to execute these projects due to a lack of proper foundations. Our
journey into data engineering began when we undertook data engineering tasks to
build foundations and infrastructure.
With the rise of data science, companies splashed out lavishly on data science talent,
hoping to reap rich rewards. Very often, data scientists struggled with basic problems
that their background and training did not address—data collection, data cleansing,
data access, data transformation, and data infrastructure. These are problems that
data engineering aims to solve.
Before we cover what this book is about and what you’ll get out of it, let’s quickly
cover what this book isn’t. This book isn’t about data engineering using a particular
tool, technology, or platform. While many excellent books approach data engineering
technologies from this perspective, these books have a short shelf life. Instead, we
focus on the fundamental concepts behind data engineering.
This book aims to fill a gap in current data engineering content and materials.
While there’s no shortage of technical resources that address specific data engineering
tools and technologies, people struggle to understand how to assemble these compo‐
nents into a coherent whole that applies in the real world. This book connects the
dots of the end-to-end data lifecycle. It shows you how to stitch together various
technologies to serve the needs of downstream data consumers such as analysts,
data scientists, and machine learning engineers. This book works as a complement
xiii

## Who Should Read This Book
to O’Reilly books that cover the details of particular technologies, platforms, and
programming languages.
The big idea of this book is the data engineering lifecycle: data generation, storage,
ingestion, transformation, and serving. Since the dawn of data, we’ve seen the rise
and fall of innumerable specific technologies and vendor products, but the data engi‐
neering lifecycle stages have remained essentially unchanged. With this framework,
the reader will come away with a sound understanding for applying technologies to
real-world business problems.
Our goal here is to map out principles that reach across two axes. First, we wish to
distill data engineering into principles that can encompass any relevant technology.
Second, we wish to present principles that will stand the test of time. We hope that
these ideas reflect lessons learned across the data technology upheaval of the last
twenty years and that our mental framework will remain useful for a decade or more
into the future.
One thing to note: we unapologetically take a cloud-first approach. We view the
cloud as a fundamentally transformative development that will endure for decades;
most on-premises data systems and workloads will eventually move to cloud hosting.
We assume that infrastructure and systems are ephemeral and scalable, and that data
engineers will lean toward deploying managed services in the cloud. That said, most
concepts in this book will translate to non-cloud environments.
Our primary intended audience for this book consists of technical practitioners, mid-
to senior-level software engineers, data scientists, or analysts interested in moving
into data engineering; or data engineers working in the guts of specific technologies,
but wanting to develop a more comprehensive perspective. Our secondary target
audience consists of data stakeholders who work adjacent to technical practition‐
ers—e.g., a data team lead with a technical background overseeing a team of data
engineers, or a director of data warehousing wanting to migrate from on-premises
technology to a cloud-based solution.
Ideally, you’re curious and want to learn—why else would you be reading this book?
You stay current with data technologies and trends by reading books and articles on
data warehousing/data lakes, batch and streaming systems, orchestration, modeling,
management, analysis, developments in cloud technologies, etc. This book will help
you weave what you’ve read into a complete picture of data engineering across
technologies and paradigms.
xiv 
Preface

## Prerequisites What You’ll Learn and How It Will Improve Your Abilities
We assume a good deal of familiarity with the types of data systems found in a
corporate setting. In addition, we assume that readers have some familiarity with
SQL and Python (or some other programming language), and experience with cloud
services.
Numerous resources are available for aspiring data engineers to practice Python and
SQL. Free online resources abound (blog posts, tutorial sites, YouTube videos), and
many new Python books are published every year.
The cloud provides unprecedented opportunities to get hands-on experience with
data tools. We suggest that aspiring data engineers set up accounts with cloud services
such as AWS, Azure, Google Cloud Platform, Snowflake, Databricks, etc. Note that
many of these platforms have free tier options, but readers should keep a close eye on
costs and work with small quantities of data and single node clusters as they study.
Developing familiarity with corporate data systems outside of a corporate environ‐
ment remains difficult, and this creates certain barriers for aspiring data engineers
who have yet to land their first data job. This book can help. We suggest that
data novices read for high-level ideas and then look at materials in the Additional
Resources section at the end of each chapter. On a second read through, note any
unfamiliar terms and technologies. You can utilize Google, Wikipedia, blog posts,
YouTube videos, and vendor sites to become familiar with new terms and fill gaps in
your understanding.
This book aims to help you build a solid foundation for solving real-world data
engineering problems.
By the end of this book you will understand:
• How data engineering impacts your current role (data scientist, software engi‐
•
neer, or data team lead)
• How to cut through the marketing hype and choose the right technologies, data
•
architecture, and processes
• How to use the data engineering lifecycle to design and build a robust
•
architecture
• Best practices for each stage of the data lifecycle
•
Preface 
xv

## Navigating This Book
And you will be able to:
• Incorporate data engineering principles in your current role (data scientist, ana‐
•
lyst, software engineer, data team lead, etc.)
• Stitch together a variety of cloud technologies to serve the needs of downstream
•
data consumers
• Assess data engineering problems with an end-to-end framework of best
•
practices
• Incorporate data governance and security across the data engineering lifecycle
•
This book is composed of four parts:
• Part I, “Foundation and Building Blocks”
•
• Part II, “The Data Engineering Lifecycle in Depth”
•
• Part III, “Security, Privacy, and the Future of Data Engineering”
•
• Appendices A and B: covering serialization and compression, and cloud net‐
•
working, respectively
In Part I, we begin by defining data engineering in Chapter 1, then map out the
data engineering lifecycle in Chapter 2. In Chapter 3, we discuss good architecture. In
Chapter 4, we introduce a framework for choosing the right technology—while we
frequently see technology and architecture conflated, these are in fact very different
topics.
Part II builds on Chapter 2 to cover the data engineering lifecycle in depth; each
lifecycle stage—data generation, storage, ingestion, transformation and serving—is
covered in its own chapter. Part II is arguably the heart of the book, and the other
chapters exist to support the core ideas covered here.
Part III covers additional topics. In Chapter 10, we discuss security and privacy. While
security has always been an important part of the data engineering profession, it has
only become more critical with the rise of for profit hacking and state sponsored
cyber attacks. And what can we say of privacy? The era of corporate privacy nihilism
is over—no company wants to see its name appear in the headline of an article on
sloppy privacy practices. Reckless handling of personal data can also have significant
legal ramifications with the advent of GDPR, CCPA, and other regulations. In short,
security and privacy must be top priorities in any data engineering work.
xvi 
Preface

## Conventions Used in This Book
In the course of working in data engineering, doing research for this book and
interviewing numerous experts, we thought a good deal about where the field is going
in the near and long term. Chapter 11 outlines our highly speculative ideas on the
future of data engineering. By its nature, the future is a slippery thing. Time will tell if
some of our ideas are correct. We would love to hear from our readers on how their
visions of the future agree with or differ from our own.
In the appendices, we cover a handful of technical topics that are extremely relevant
to the day-to-day practice of data engineering but didn’t fit into the main body of
the text. Specifically, engineers need to understand serialization and compression
(see Appendix A) both to work directly with data files and to assess performance
considerations in data systems, and cloud networking (see Appendix B) is a critical
topic as data engineering shifts into the cloud.
The following typographical conventions are used in this book:
Italic
Indicates new terms, URLs, email addresses, filenames, and file extensions
Constant width
Used for program listings, as well as within paragraphs to refer to program
elements such as variable or function names, databases, data types, environment
variables, statements, and keywords
This element signifies a tip or suggestion.
This element signifies a general note.
This element indicates a warning or caution.
Preface 
xvii

## How to Contact Us Acknowledgments
Please address comments and questions concerning this book to the publisher:
O’Reilly Media, Inc.
1005 Gravenstein Highway North
Sebastopol, CA 95472
800-998-9938 (in the United States or Canada)
707-829-0515 (international or local)
707-829-0104 (fax)
We have a web page for this book, where we list errata, examples, and any additional
information. You can access this page at https://oreil.ly/fundamentals-of-data.
Email bookquestions@oreilly.com to comment or ask technical questions about this
book.
For news and information about our books and courses, visit https://oreilly.com.
Find us on LinkedIn: https://linkedin.com/company/oreilly-media
Follow us on Twitter: https://twitter.com/oreillymedia
Watch us on YouTube: https://www.youtube.com/oreillymedia
When we started writing this book, we were warned by many people that we faced a
hard task. A book like this has a lot of moving parts, and due to its comprehensive
view of the field of data engineering, it required a ton of research, interviews, discus‐
sions, and deep thinking. We won’t claim to have captured every nuance of data
engineering, but we hope that the results resonate with you. Numerous individuals
contributed to our efforts, and we’re grateful for the support we received from many
experts.
First, thanks to our amazing crew of technical reviewers. They slogged through many
readings and gave invaluable (and often ruthlessly blunt) feedback. This book would
be a fraction of itself without their efforts. In no particular order, we give endless
thanks to Bill Inmon, Andy Petrella, Matt Sharp, Tod Hanseman, Chris Tabb, Danny
Lebzyon, Martin Kleppman, Scott Lorimor, Nick Schrock, Lisa Steckman, Veronika
Durgin, and Alex Woolford.
Second, we’ve had a unique opportunity to talk with the leading experts in the field
of data on our live shows, podcasts, meetups, and endless private calls. Their ideas
helped shape our book. There are too many people to name individually, but we’d
like to give shoutouts to Jordan Tigani, Zhamak Dehghani, Ananth Packkildurai,
xviii 
Preface

Shruti Bhat, Eric Tschetter, Benn Stancil, Kevin Hu, Michael Rogove, Ryan Wright,
Adi Polak, Shinji Kim, Andreas Kretz, Egor Gryaznov, Chad Sanderson, Julie Price,
Matt Turck, Monica Rogati, Mars Lan, Pardhu Gunnam, Brian Suk, Barr Moses, Lior
Gavish, Bruno Aziza, Gian Merlino, DeVaris Brown, Todd Beauchene, Tudor Girba,
Scott Taylor, Ori Rafael, Lee Edwards, Bryan Offutt, Ollie Hughes, Gilbert Eijkelen‐
boom, Chris Bergh, Fabiana Clemente, Andreas Kretz, Ori Reshef, Nick Singh, Mark
Balkenende, Kenten Danas, Brian Olsen, Lior Gavish, Rhaghu Murthy, Greg Coquillo,
David Aponte, Demetrios Brinkmann, Sarah Catanzaro, Michel Tricot, Levi Davis,
Ted Walker, Carlos Kemeny, Josh Benamram, Chanin Nantasenamat, George Firican,
Jordan Goldmeir, Minhaaj Rehmam, Luigi Patruno, Vin Vashista, Danny Ma, Jesse
Anderson, Alessya Visnjic, Vishal Singh, Dave Langer, Roy Hasson, Todd Odess, Che
Sharma, Scott Breitenother, Ben Taylor, Thom Ives, John Thompson, Brent Dykes,
Josh Tobin, Mark Kosiba, Tyler Pugliese, Douwe Maan, Martin Traverso, Curtis
Kowalski, Bob Davis, Koo Ping Shung, Ed Chenard, Matt Sciorma, Tyler Folkman,
Jeff Baird, Tejas Manohar, Paul Singman, Kevin Stumpf, Willem Pineaar, and Michael
Del Balso from Tecton, Emma Dahl, Harpreet Sahota, Ken Jee, Scott Taylor, Kate
Strachnyi, Kristen Kehrer, Taylor Miller, Abe Gong, Ben Castleton, Ben Rogojan,
David Mertz, Emmanuel Raj, Andrew Jones, Avery Smith, Brock Cooper, Jeff Larson,
Jon King, Holden Ackerman, Miriah Peterson, Felipe Hoffa, David Gonzalez, Richard
Wellman, Susan Walsh, Ravit Jain, Lauren Balik, Mikiko Bazeley, Mark Freeman,
Mike Wimmer, Alexey Shchedrin, Mary Clair Thompson, Julie Burroughs, Jason
Pedley, Freddy Drennan, Jason Pedley, Kelly and Matt Phillipps, Brian Campbell,
Faris Chebib, Dylan Gregerson, Ken Myers, Jake Carter, Seth Paul, Ethan Aaron, and
many others.
If you’re not mentioned specifically, don’t take it personally. You know who you are.
Let us know and we’ll get you on the next edition.
We’d also like to thank the Ternary Data team (Colleen McAuley, Maike Wells, Patrick
Dahl, Aaron Hunsaker, and others), our students, and the countless people around
the world who’ve supported us. It’s a great reminder the world is a very small place.
Working with the O’Reilly crew was amazing! Special thanks to Jess Haberman
for having confidence in us during the book proposal process, our amazing and
extremely patient development editors Nicole Taché and Michele Cronin for invalua‐
ble editing, feedback, and support. Thank you also to the superb production team at
O’Reilly (Greg and crew).
Joe would like to thank his family—Cassie, Milo, and Ethan—for letting him write a
book. They had to endure a ton, and Joe promises to never write a book again. ;)
Matt would like to thank his friends and family for their enduring patience and
support. He’s still hopeful that Seneca will deign to give a five-star review after a good
deal of toil and missed family time around the holidays.
Preface 
xix
