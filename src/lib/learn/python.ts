import type { QuizQuestion } from "./course";

export type CodeExample = { title: string; code: string; output: string };
export type PyModule = {
  id: string;
  title: string;
  minutes: number;
  explain: string[];
  concepts: { term: string; meaning: string }[];
  examples: string[];
  code: CodeExample[];
  exercise: { title: string; task: string; hint: string; solution: string; expected: string };
  quiz: QuizQuestion[];
};

export const PY_COURSE = {
  id: "python-fundamentals",
  title: "Python Fundamentals — Beginner to Practical",
  description:
    "Learn Python from zero: write your first lines, make decisions, repeat tasks, organise data and finish with a real study-tracker project.",
};

export const PY_PROJECT_ID = "py-project";

export const PY_PROJECT = {
  title: "Python Student Study Tracker",
  goal: "Build a small program that records what you studied and for how long, and saves it to a file so it is still there tomorrow.",
  features: [
    "Add a study subject",
    "Record study time in minutes",
    "View saved subjects",
    "Show total study time",
    "Save basic data to a local file",
  ],
  steps: [
    {
      title: "Store study sessions in a dictionary",
      task: "Create an empty dictionary called study. The key will be the subject name and the value will be total minutes.",
      hint: "An empty dictionary is written with curly brackets: {}",
      code: `study = {}`,
    },
    {
      title: "Write a function to add study time",
      task: "Write add_session(subject, minutes). If the subject already exists, add to its minutes; otherwise create it.",
      hint: "Use study.get(subject, 0) to get the current minutes or 0 if new.",
      code: `def add_session(subject, minutes):
    study[subject] = study.get(subject, 0) + minutes`,
    },
    {
      title: "Show saved subjects and the total",
      task: "Write show_summary() that prints each subject with its minutes, then prints the total using sum().",
      hint: "Loop with: for subject, minutes in study.items():",
      code: `def show_summary():
    for subject, minutes in study.items():
        print(subject, "-", minutes, "min")
    print("Total:", sum(study.values()), "min")`,
    },
    {
      title: "Save and load from a file",
      task: "Write save() to write each subject as 'subject,minutes' on its own line in study.txt, and load() to read them back.",
      hint: "Use with open('study.txt', 'w') to write and 'r' to read. Wrap load() in try/except FileNotFoundError.",
      code: `def save():
    with open("study.txt", "w") as f:
        for subject, minutes in study.items():
            f.write(f"{subject},{minutes}\\n")

def load():
    try:
        with open("study.txt", "r") as f:
            for line in f:
                subject, minutes = line.strip().split(",")
                study[subject] = int(minutes)
    except FileNotFoundError:
        pass`,
    },
    {
      title: "Add a simple menu loop",
      task: "Use a while loop that asks the user to choose: 1 Add, 2 View, 3 Quit. Load at the start and save before quitting.",
      hint: "Use input() for the choice and break to leave the loop.",
      code: `load()
while True:
    choice = input("1 Add  2 View  3 Quit: ")
    if choice == "1":
        subject = input("Subject: ")
        minutes = int(input("Minutes: "))
        add_session(subject, minutes)
    elif choice == "2":
        show_summary()
    elif choice == "3":
        save()
        print("Saved. Keep studying!")
        break`,
    },
  ],
  expected: `1 Add  2 View  3 Quit: 1
Subject: Maths
Minutes: 40
1 Add  2 View  3 Quit: 2
Maths - 40 min
Total: 40 min
1 Add  2 View  3 Quit: 3
Saved. Keep studying!`,
  checklist: [
    "My program can add a subject with minutes",
    "Adding the same subject again increases its minutes",
    "View shows every subject and the correct total",
    "Data is saved in study.txt and loads again next time",
    "I ran the program on my own computer or an online Python editor",
  ],
};

export const PY_MODULES: PyModule[] = [
  {
    id: "py-intro",
    title: "Python Introduction",
    minutes: 10,
    explain: [
      "A program is a list of instructions for the computer. Python is a programming language that lets you write those instructions in words that look close to simple English.",
      "Python is popular in AI, data science, websites and automation because it is easy to read and has many ready-made tools (libraries).",
      "You can run Python on your computer after installing it from python.org, or in a free online Python editor on your phone or laptop. Python runs your code from top to bottom, one line at a time.",
    ],
    concepts: [
      { term: "Program", meaning: "A set of instructions the computer follows." },
      { term: "print()", meaning: "Shows text or values on the screen." },
      { term: "Comment", meaning: "A note starting with # that Python ignores." },
      { term: "Error", meaning: "A message when Python cannot understand or run a line." },
    ],
    examples: [
      "A shop owner using a script to add up daily sales.",
      "A student printing a timetable automatically.",
      "AI tools like chatbots are often built with Python.",
    ],
    code: [
      { title: "Your first program", code: `# This is a comment\nprint("Namaste, Python!")`, output: "Namaste, Python!" },
      { title: "Printing numbers", code: `print(10 + 5)\nprint("Total:", 10 + 5)`, output: "15\nTotal: 15" },
    ],
    exercise: {
      title: "Introduce yourself",
      task: "Write a program that prints your name on one line and your city on the next line.",
      hint: "Use print() twice. Text must be inside quotes.",
      solution: `print("My name is Asha")\nprint("I live in Pune")`,
      expected: "My name is Asha\nI live in Pune",
    },
    quiz: [
      { q: "What does print() do?", options: ["Deletes text", "Shows output on the screen", "Saves a file"], answer: 1 },
      { q: "Which symbol starts a comment?", options: ["//", "#", "--"], answer: 1 },
      { q: "In what order does Python run lines?", options: ["Random", "Bottom to top", "Top to bottom"], answer: 2 },
    ],
  },
  {
    id: "py-variables",
    title: "Variables & Data Types",
    minutes: 12,
    explain: [
      "A variable is a named box that stores a value. You create it with =, for example age = 17. Later you can use the name instead of the value.",
      "Each value has a type. Common types are int (whole numbers), float (decimals), str (text in quotes) and bool (True or False).",
      "Use type() to check a value's type. input() always gives text, so convert it with int() or float() when you need a number.",
    ],
    concepts: [
      { term: "Variable", meaning: "A name that stores a value." },
      { term: "int / float", meaning: "Whole number / decimal number." },
      { term: "str", meaning: "Text, written inside quotes." },
      { term: "bool", meaning: "True or False." },
    ],
    examples: [
      "Storing a student's name, class and percentage.",
      "Keeping the price of an item in a shopping app.",
      "Remembering whether a user is logged in (True/False).",
    ],
    code: [
      { title: "Creating variables", code: `name = "Ravi"\nage = 17\nmarks = 88.5\nprint(name, age, marks)`, output: "Ravi 17 88.5" },
      { title: "Checking types", code: `print(type(age))\nprint(type(name))`, output: "<class 'int'>\n<class 'str'>" },
    ],
    exercise: {
      title: "Student information program",
      task: "Store a student's name, class, school and percentage in variables, then print them in a neat format.",
      hint: "Use an f-string: print(f\"Name: {name}\") puts the variable inside the text.",
      solution: `name = "Priya"\nstudent_class = 10\nschool = "Kendriya Vidyalaya"\npercent = 91.4\nprint(f"Name: {name}")\nprint(f"Class: {student_class}")\nprint(f"School: {school}")\nprint(f"Percentage: {percent}%")`,
      expected: "Name: Priya\nClass: 10\nSchool: Kendriya Vidyalaya\nPercentage: 91.4%",
    },
    quiz: [
      { q: "What is the type of 3.5?", options: ["int", "float", "str"], answer: 1 },
      { q: "Which line creates a variable correctly?", options: ["city = \"Delhi\"", "\"Delhi\" = city", "city == Delhi"], answer: 0 },
      { q: "What type does input() return?", options: ["int", "bool", "str"], answer: 2 },
    ],
  },
  {
    id: "py-operators",
    title: "Operators",
    minutes: 12,
    explain: [
      "Operators are symbols that do work on values. Arithmetic operators: + - * / for add, subtract, multiply, divide. // gives division without decimals, % gives the remainder, ** gives power.",
      "Comparison operators compare two values and give True or False: == (equal), != (not equal), >, <, >=, <=.",
      "Logical operators combine conditions: and (both true), or (at least one true), not (reverses True/False).",
    ],
    concepts: [
      { term: "Arithmetic", meaning: "+ - * / // % ** for maths." },
      { term: "Comparison", meaning: "== != > < >= <= give True/False." },
      { term: "Logical", meaning: "and, or, not combine conditions." },
      { term: "%", meaning: "Remainder after division (modulus)." },
    ],
    examples: [
      "Calculating a bill total with GST.",
      "Checking if a number is even using % 2.",
      "Checking if marks are at least 33 to pass.",
    ],
    code: [
      { title: "Maths in Python", code: `print(17 // 5)\nprint(17 % 5)\nprint(2 ** 3)`, output: "3\n2\n8" },
      { title: "Comparisons", code: `marks = 72\nprint(marks >= 33)\nprint(marks > 90 and marks < 100)`, output: "True\nFalse" },
    ],
    exercise: {
      title: "Bill calculator",
      task: "A item costs ₹250 and you buy 3. Add 18% GST and print the subtotal, GST amount and final total.",
      hint: "gst = subtotal * 18 / 100",
      solution: `price = 250\nqty = 3\nsubtotal = price * qty\ngst = subtotal * 18 / 100\nprint("Subtotal:", subtotal)\nprint("GST:", gst)\nprint("Total:", subtotal + gst)`,
      expected: "Subtotal: 750\nGST: 135.0\nTotal: 885.0",
    },
    quiz: [
      { q: "What is 10 % 3?", options: ["3", "1", "0"], answer: 1 },
      { q: "Which operator checks equality?", options: ["=", "==", "=>"], answer: 1 },
      { q: "True and False gives…", options: ["True", "False", "Error"], answer: 1 },
    ],
  },
  {
    id: "py-conditions",
    title: "Conditions — if / elif / else",
    minutes: 14,
    explain: [
      "Conditions let a program make decisions. if checks a condition; when it is True, the indented code below it runs.",
      "elif (else if) checks another condition when the earlier ones were False. else runs when nothing above was True.",
      "Indentation (4 spaces) matters in Python — it shows which lines belong to which block. A colon : ends every if, elif and else line.",
    ],
    concepts: [
      { term: "if", meaning: "Runs code only when a condition is True." },
      { term: "elif", meaning: "Checks another condition if earlier ones failed." },
      { term: "else", meaning: "Runs when no condition was True." },
      { term: "Indentation", meaning: "Spaces that group lines into a block." },
    ],
    examples: [
      "Giving a grade based on marks.",
      "Checking if someone is old enough to vote.",
      "Showing 'Good morning' or 'Good evening' based on time.",
    ],
    code: [
      {
        title: "Grade calculator",
        code: `marks = 78\nif marks >= 90:\n    print("Grade A")\nelif marks >= 60:\n    print("Grade B")\nelse:\n    print("Keep practising")`,
        output: "Grade B",
      },
    ],
    exercise: {
      title: "Eligibility checker",
      task: "Store a person's age. Print 'Eligible to vote' if age is 18 or more, otherwise print how many years are left.",
      hint: "Years left = 18 - age",
      solution: `age = 15\nif age >= 18:\n    print("Eligible to vote")\nelse:\n    print("Not yet. Years left:", 18 - age)`,
      expected: "Not yet. Years left: 3",
    },
    quiz: [
      { q: "What ends an if line?", options: [";", ":", "."], answer: 1 },
      { q: "When does else run?", options: ["Always", "When all conditions above are False", "Before if"], answer: 1 },
      { q: "Why is indentation important?", options: ["It shows which lines belong to a block", "It makes code colourful", "It is optional decoration"], answer: 0 },
    ],
  },
  {
    id: "py-loops",
    title: "Loops — for / while",
    minutes: 14,
    explain: [
      "Loops repeat code so you don't have to write the same line many times.",
      "A for loop repeats for each item in a sequence. range(1, 6) gives 1, 2, 3, 4, 5 — the end number is not included.",
      "A while loop repeats as long as a condition is True. Make sure something changes inside the loop, or it will never stop. break exits a loop early.",
    ],
    concepts: [
      { term: "for", meaning: "Repeats for each item in a sequence." },
      { term: "range()", meaning: "Creates a sequence of numbers." },
      { term: "while", meaning: "Repeats while a condition is True." },
      { term: "break", meaning: "Stops the loop immediately." },
    ],
    examples: [
      "Printing a multiplication table.",
      "Sending a reminder to every student in a list.",
      "Asking for a password until it is correct.",
    ],
    code: [
      { title: "for loop", code: `for i in range(1, 4):\n    print("Step", i)`, output: "Step 1\nStep 2\nStep 3" },
      { title: "while loop", code: `count = 3\nwhile count > 0:\n    print(count)\n    count = count - 1\nprint("Go!")`, output: "3\n2\n1\nGo!" },
    ],
    exercise: {
      title: "Number table program",
      task: "Print the multiplication table of 7 from 7 × 1 to 7 × 10.",
      hint: "Use for i in range(1, 11) and print(f\"7 x {i} = {7 * i}\")",
      solution: `n = 7\nfor i in range(1, 11):\n    print(f"{n} x {i} = {n * i}")`,
      expected: "7 x 1 = 7\n7 x 2 = 14\n...\n7 x 10 = 70",
    },
    quiz: [
      { q: "What does range(1, 4) give?", options: ["1, 2, 3, 4", "1, 2, 3", "0, 1, 2, 3"], answer: 1 },
      { q: "What can happen if a while condition never becomes False?", options: ["Infinite loop", "Syntax error", "Nothing"], answer: 0 },
      { q: "Which keyword exits a loop early?", options: ["stop", "exit", "break"], answer: 2 },
    ],
  },
  {
    id: "py-collections",
    title: "Lists, Tuples & Dictionaries",
    minutes: 16,
    explain: [
      "A list stores many values in order inside square brackets: subjects = [\"Maths\", \"Science\"]. Lists can change — use append() to add an item. Positions (indexes) start at 0.",
      "A tuple is like a list but cannot be changed after creation. It uses round brackets: point = (10, 20).",
      "A dictionary stores key–value pairs in curly brackets: student = {\"name\": \"Ravi\", \"age\": 17}. You look up values by key, like a word in a dictionary.",
    ],
    concepts: [
      { term: "List [ ]", meaning: "Ordered, changeable collection." },
      { term: "Tuple ( )", meaning: "Ordered, unchangeable collection." },
      { term: "Dictionary { }", meaning: "Key–value pairs, looked up by key." },
      { term: "Index", meaning: "Position of an item, starting at 0." },
    ],
    examples: [
      "A list of students in a class.",
      "A tuple for fixed GPS coordinates.",
      "A dictionary of subject → marks for a report card.",
    ],
    code: [
      { title: "List", code: `subjects = ["Maths", "Science"]\nsubjects.append("English")\nprint(subjects[0], len(subjects))`, output: "Maths 3" },
      { title: "Dictionary", code: `marks = {"Maths": 85, "Science": 92}\nprint(marks["Science"])\nmarks["English"] = 78\nprint(len(marks))`, output: "92\n3" },
    ],
    exercise: {
      title: "Simple student list",
      task: "Create a list of 3 student names, add one more, then print each name with its roll number starting from 1.",
      hint: "Use enumerate(students, start=1) in a for loop.",
      solution: `students = ["Aman", "Neha", "Kabir"]\nstudents.append("Sara")\nfor roll, name in enumerate(students, start=1):\n    print(roll, name)`,
      expected: "1 Aman\n2 Neha\n3 Kabir\n4 Sara",
    },
    quiz: [
      { q: "What is the index of the first item in a list?", options: ["1", "0", "-1"], answer: 1 },
      { q: "Which collection cannot be changed?", options: ["List", "Dictionary", "Tuple"], answer: 2 },
      { q: "How do you get a value from a dictionary?", options: ["By its key", "By its colour", "Only by looping"], answer: 0 },
    ],
  },
  {
    id: "py-strings",
    title: "Strings",
    minutes: 12,
    explain: [
      "A string is text inside quotes. You can join strings with + and repeat them with *.",
      "Strings have useful methods: upper(), lower(), strip() (removes extra spaces), replace() and split() (breaks text into a list).",
      "You can take parts of a string with slicing: text[0:3] gives the first 3 characters. f-strings like f\"Hi {name}\" insert values into text neatly.",
    ],
    concepts: [
      { term: "String", meaning: "Text inside quotes." },
      { term: "Method", meaning: "An action on a value, like text.upper()." },
      { term: "Slicing", meaning: "Taking part of a string with [start:end]." },
      { term: "f-string", meaning: "Text with {values} placed inside." },
    ],
    examples: [
      "Cleaning a user's typed name before saving it.",
      "Making a username from a first name.",
      "Counting words in a paragraph.",
    ],
    code: [
      { title: "String methods", code: `name = "  sunita sharma  "\nclean = name.strip().title()\nprint(clean)\nprint(clean.split())`, output: "Sunita Sharma\n['Sunita', 'Sharma']" },
      { title: "Slicing", code: `word = "Saathiya"\nprint(word[0:4])\nprint(len(word))`, output: "Saat\n8" },
    ],
    exercise: {
      title: "Username maker",
      task: "Take a full name like 'Rohan Verma', and print a username: first name in lowercase + the length of the full name.",
      hint: "first = full.split()[0].lower()",
      solution: `full = "Rohan Verma"\nfirst = full.split()[0].lower()\nprint(first + str(len(full)))`,
      expected: "rohan11",
    },
    quiz: [
      { q: "What does \"hi\".upper() give?", options: ["Hi", "HI", "hi"], answer: 1 },
      { q: "What does strip() remove?", options: ["Extra spaces at the ends", "All vowels", "Numbers"], answer: 0 },
      { q: "What is \"Python\"[0:2]?", options: ["Py", "Pyt", "yt"], answer: 0 },
    ],
  },
  {
    id: "py-functions",
    title: "Functions",
    minutes: 15,
    explain: [
      "A function is a reusable block of code with a name. You define it once with def and call it whenever you need it.",
      "Functions can take inputs called parameters, and can send back a result with return.",
      "Functions keep programs short, organised and easy to fix — if something is wrong, you fix it in one place.",
    ],
    concepts: [
      { term: "def", meaning: "Keyword used to create a function." },
      { term: "Parameter", meaning: "An input the function receives." },
      { term: "return", meaning: "Sends a result back to the caller." },
      { term: "Call", meaning: "Running a function by writing its name()." },
    ],
    examples: [
      "A function that calculates percentage from marks.",
      "A greeting function used for every new user.",
      "A converter from Celsius to Fahrenheit.",
    ],
    code: [
      { title: "Function with return", code: `def percentage(got, total):\n    return got / total * 100\n\nprint(percentage(45, 50))`, output: "90.0" },
    ],
    exercise: {
      title: "Reusable calculator functions",
      task: "Write add(a, b), subtract(a, b), multiply(a, b) and divide(a, b). divide should return a message if b is 0. Test each one.",
      hint: "Inside divide, use: if b == 0: return \"Cannot divide by zero\"",
      solution: `def add(a, b):\n    return a + b\n\ndef subtract(a, b):\n    return a - b\n\ndef multiply(a, b):\n    return a * b\n\ndef divide(a, b):\n    if b == 0:\n        return "Cannot divide by zero"\n    return a / b\n\nprint(add(8, 2), subtract(8, 2), multiply(8, 2), divide(8, 2))\nprint(divide(5, 0))`,
      expected: "10 6 16 4.0\nCannot divide by zero",
    },
    quiz: [
      { q: "Which keyword creates a function?", options: ["func", "def", "function"], answer: 1 },
      { q: "What does return do?", options: ["Prints text", "Sends a result back", "Stops Python"], answer: 1 },
      { q: "Main benefit of functions?", options: ["Reuse code", "Make code slower", "Hide errors"], answer: 0 },
    ],
  },
  {
    id: "py-files",
    title: "File Handling",
    minutes: 14,
    explain: [
      "Variables are lost when a program ends. Files let you save data so it is still there next time.",
      "open(filename, mode) opens a file. Modes: \"w\" writes (replaces old content), \"a\" appends (adds to the end), \"r\" reads.",
      "Use with open(...) as f: — Python closes the file automatically. If a file may not exist yet, handle it with try / except FileNotFoundError.",
    ],
    concepts: [
      { term: "open()", meaning: "Opens a file for reading or writing." },
      { term: "\"w\" / \"a\" / \"r\"", meaning: "Write / append / read modes." },
      { term: "with", meaning: "Opens and safely closes a file." },
      { term: "try / except", meaning: "Handles errors without crashing." },
    ],
    examples: [
      "Saving daily notes or a diary.",
      "Keeping a log of expenses.",
      "Storing high scores for a small game.",
    ],
    code: [
      { title: "Write then read", code: `with open("hello.txt", "w") as f:\n    f.write("Learning Python!")\n\nwith open("hello.txt", "r") as f:\n    print(f.read())`, output: "Learning Python!" },
    ],
    exercise: {
      title: "Save and read simple notes",
      task: "Ask the user for a note, append it to notes.txt on a new line, then print all saved notes.",
      hint: "Use mode \"a\" and add \\n at the end of each note.",
      solution: `note = input("Write a note: ")\nwith open("notes.txt", "a") as f:\n    f.write(note + "\\n")\n\nprint("Your notes:")\nwith open("notes.txt", "r") as f:\n    for line in f:\n        print("-", line.strip())`,
      expected: "Write a note: Revise loops\nYour notes:\n- Revise loops",
    },
    quiz: [
      { q: "Which mode adds to the end of a file?", options: ["\"w\"", "\"a\"", "\"r\""], answer: 1 },
      { q: "Why use with open(...)?", options: ["It closes the file automatically", "It deletes the file", "It is faster typing only"], answer: 0 },
      { q: "What does \"w\" mode do to existing content?", options: ["Keeps it", "Replaces it", "Reads it"], answer: 1 },
    ],
  },
  {
    id: "py-project",
    title: "Beginner Python Project",
    minutes: 30,
    explain: [
      "Time to combine everything: variables, conditions, loops, dictionaries, functions and files. Real programs are built this way — small pieces joined together.",
      "You will plan and build the Python Student Study Tracker step by step. Try each step yourself first, then reveal the hint or sample code only if you get stuck.",
      "Run your program on your own computer or in a free online Python editor. Saathiya does not run code here — that keeps your device safe.",
    ],
    concepts: [
      { term: "Planning", meaning: "Deciding features before writing code." },
      { term: "Menu loop", meaning: "A while loop that keeps asking what to do next." },
      { term: "Persistence", meaning: "Saving data to a file so it lasts." },
      { term: "Testing", meaning: "Trying inputs to check the program works." },
    ],
    examples: [
      "Tracking hours studied before board exams.",
      "A simple expense or attendance tracker.",
      "A habit tracker for daily practice.",
    ],
    code: [
      { title: "The plan in plain Python comments", code: `# 1. Store subjects and minutes\n# 2. Add study time\n# 3. Show subjects and total\n# 4. Save / load from study.txt\n# 5. Menu to choose actions`, output: "(Comments only — no output)" },
    ],
    exercise: {
      title: "Python Student Study Tracker",
      task: "Follow the 5 project steps below and build the full tracker.",
      hint: "Build and test one step at a time.",
      solution: "",
      expected: "",
    },
    quiz: [
      { q: "Which data type best maps subject → minutes?", options: ["Tuple", "Dictionary", "String"], answer: 1 },
      { q: "How do we keep data after the program closes?", options: ["Use a bigger variable", "Save it to a file", "Use print()"], answer: 1 },
      { q: "Which loop keeps a menu running until the user quits?", options: ["while True with break", "for i in range(1)", "No loop needed"], answer: 0 },
    ],
  },
];
