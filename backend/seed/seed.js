require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Snippet = require('../models/Snippet');

const snippets = [
    {
        title: 'Bubble Sort in JavaScript',
        language: 'javascript',
        description: 'Classic O(n²) sorting algorithm that repeatedly swaps adjacent elements',
        code: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
console.log(bubbleSort([64, 34, 25, 12, 22, 11, 90]));`,
        tags: ['sorting', 'algorithm', 'array'],
    },
    {
        title: 'Binary Search in Python',
        language: 'python',
        description: 'Efficient O(log n) search algorithm for sorted arrays',
        code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

arr = [1, 3, 5, 7, 9, 11, 13]
print(binary_search(arr, 7))  # Output: 3`,
        tags: ['search', 'algorithm', 'binary-search'],
    },
    {
        title: 'Async/Await Fetch with Error Handling',
        language: 'javascript',
        description: 'Fetch API wrapper using async/await with proper error handling',
        code: `async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error.message);
    throw error;
  }
}

// Usage
fetchData('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(err => console.error(err));`,
        tags: ['async', 'fetch', 'promises', 'error-handling'],
    },
    {
        title: 'Python Decorator for Timing Functions',
        language: 'python',
        description: 'A decorator that measures and prints execution time of any function',
        code: `import time
import functools

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        end = time.perf_counter()
        print(f"{func.__name__} took {end - start:.4f} seconds")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
    return "done"

slow_function()`,
        tags: ['decorator', 'performance', 'timing', 'python'],
    },
    {
        title: 'TypeScript Generic Stack',
        language: 'typescript',
        description: 'A type-safe generic stack data structure implementation',
        code: `class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

const stack = new Stack<number>();
stack.push(1);
stack.push(2);
console.log(stack.peek()); // 2
console.log(stack.pop());  // 2`,
        tags: ['data-structure', 'stack', 'generics', 'typescript'],
    },
    {
        title: 'SQL Find Duplicate Records',
        language: 'sql',
        description: 'Query to identify duplicate records based on specific columns',
        code: `SELECT 
    email,
    COUNT(*) as duplicate_count
FROM users
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Delete duplicates keeping the lowest id
DELETE FROM users
WHERE id NOT IN (
    SELECT MIN(id)
    FROM users
    GROUP BY email
);`,
        tags: ['sql', 'duplicates', 'query', 'database'],
    },
    {
        title: 'React Custom Hook - useLocalStorage',
        language: 'javascript',
        description: 'Custom React hook for persisting state in localStorage',
        code: `import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;`,
        tags: ['react', 'hook', 'localstorage', 'state'],
    },
    {
        title: 'Go Goroutine with Channel',
        language: 'go',
        description: 'Concurrent data processing using goroutines and channels',
        code: `package main

import (
    "fmt"
    "sync"
)

func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
    defer wg.Done()
    for j := range jobs {
        result := j * j // square the number
        fmt.Printf("Worker %d processed job %d\\n", id, j)
        results <- result
    }
}

func main() {
    jobs := make(chan int, 10)
    results := make(chan int, 10)
    var wg sync.WaitGroup

    for w := 1; w <= 3; w++ {
        wg.Add(1)
        go worker(w, jobs, results, &wg)
    }

    for j := 1; j <= 9; j++ {
        jobs <- j
    }
    close(jobs)

    go func() {
        wg.Wait()
        close(results)
    }()

    for r := range results {
        fmt.Println("Result:", r)
    }
}`,
        tags: ['go', 'concurrency', 'goroutine', 'channel'],
    },
    {
        title: 'Python List Comprehensions',
        language: 'python',
        description: 'Examples of powerful Python list comprehensions for common tasks',
        code: `# Filter even numbers
evens = [x for x in range(20) if x % 2 == 0]
print(evens)  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# Flatten nested list
nested = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = [num for sublist in nested for num in sublist]
print(flat)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Dictionary comprehension
squares = {x: x**2 for x in range(6)}
print(squares)  # {0:0, 1:1, 2:4, 3:9, 4:16, 5:25}

# Set comprehension to remove duplicates
words = ['hello', 'world', 'hello', 'python']
unique = {word.upper() for word in words}
print(unique)`,
        tags: ['python', 'list-comprehension', 'functional', 'one-liner'],
    },
    {
        title: 'Express.js JWT Authentication Middleware',
        language: 'javascript',
        description: 'Middleware to protect routes using JSON Web Tokens',
        code: `const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Usage
// app.get('/protected', authMiddleware, (req, res) => {
//   res.json({ user: req.user });
// });

module.exports = authMiddleware;`,
        tags: ['jwt', 'authentication', 'middleware', 'express', 'security'],
    },
    {
        title: 'CSS Grid Layout - Responsive Dashboard',
        language: 'css',
        description: 'Responsive dashboard layout using CSS Grid with auto-fill columns',
        code: `.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-template-rows: auto;
  gap: 1.5rem;
  padding: 1.5rem;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.12);
}

.card--wide {
  grid-column: span 2;
}

@media (max-width: 640px) {
  .card--wide {
    grid-column: span 1;
  }
}`,
        tags: ['css', 'grid', 'responsive', 'layout', 'dashboard'],
    },
    {
        title: 'MongoDB Aggregation Pipeline',
        language: 'javascript',
        description: 'Aggregation pipeline to calculate stats grouped by category',
        code: `// In Mongoose
const stats = await Product.aggregate([
  { $match: { active: true } },
  {
    $group: {
      _id: '$category',
      totalProducts: { $sum: 1 },
      avgPrice: { $avg: '$price' },
      minPrice: { $min: '$price' },
      maxPrice: { $max: '$price' },
    },
  },
  { $sort: { totalProducts: -1 } },
  { $limit: 10 },
  {
    $project: {
      category: '$_id',
      totalProducts: 1,
      avgPrice: { $round: ['$avgPrice', 2] },
      priceRange: { $subtract: ['$maxPrice', '$minPrice'] },
      _id: 0,
    },
  },
]);`,
        tags: ['mongodb', 'aggregation', 'pipeline', 'database', 'nosql'],
    },
    {
        title: 'Python Context Manager',
        language: 'python',
        description: 'Custom context manager for managing resources with __enter__ and __exit__',
        code: `class DatabaseConnection:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.connection = None

    def __enter__(self):
        print(f"Connecting to {self.host}:{self.port}")
        self.connection = f"conn_{self.host}"  # Simulated connection
        return self.connection

    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Closing connection")
        self.connection = None
        if exc_type:
            print(f"An error occurred: {exc_val}")
        return False  # Don't suppress exceptions

# Usage
with DatabaseConnection("localhost", 5432) as conn:
    print(f"Using {conn}")
    # Automatically closes after block`,
        tags: ['python', 'context-manager', 'with-statement', 'resources'],
    },
    {
        title: 'TypeScript Utility Types',
        language: 'typescript',
        description: 'Common TypeScript utility types with practical examples',
        code: `interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Partial - all fields optional
type UpdateUserDto = Partial<User>;

// Pick - select specific fields
type PublicUser = Pick<User, 'id' | 'name' | 'email'>;

// Omit - exclude specific fields
type CreateUserDto = Omit<User, 'id' | 'createdAt'>;

// Required - all fields required
type StrictUser = Required<User>;

// Readonly - prevent mutation
type FrozenUser = Readonly<User>;

// Record - mapped type
type UserMap = Record<number, PublicUser>;

// ReturnType - infer return type
async function getUser(id: number): Promise<User> { /* ... */ return {} as User; }
type GetUserReturn = Awaited<ReturnType<typeof getUser>>;`,
        tags: ['typescript', 'utility-types', 'generics', 'type-safety'],
    },
    {
        title: 'Quick Sort in Python',
        language: 'python',
        description: 'Efficient O(n log n) divide-and-conquer sorting algorithm',
        code: `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left   = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right  = [x for x in arr if x > pivot]
    
    return quicksort(left) + middle + quicksort(right)

print(quicksort([3, 6, 8, 10, 1, 2, 1]))
# Output: [1, 1, 2, 3, 6, 8, 10]`,
        tags: ['sorting', 'algorithm', 'quicksort', 'divide-and-conquer'],
    },
    {
        title: 'Debounce Function',
        language: 'javascript',
        description: 'Debounce utility to limit how often a function is called',
        code: `function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Usage in React
const handleSearch = debounce((query) => {
  console.log('Searching for:', query);
  fetchResults(query);
}, 300);

// Usage in plain JS
const input = document.getElementById('search');
input.addEventListener('input', (e) => handleSearch(e.target.value));`,
        tags: ['debounce', 'performance', 'utility', 'event-handling'],
    },
    {
        title: 'SQL Window Functions',
        language: 'sql',
        description: 'Window functions for ranking and running totals',
        code: `-- Rank employees by salary within each department
SELECT 
    employee_id,
    name,
    department,
    salary,
    RANK() OVER (PARTITION BY department ORDER BY salary DESC) as dept_rank,
    ROW_NUMBER() OVER (ORDER BY salary DESC) as overall_rank,
    SUM(salary) OVER (PARTITION BY department) as dept_total,
    AVG(salary) OVER (PARTITION BY department) as dept_avg,
    salary - AVG(salary) OVER (PARTITION BY department) as diff_from_avg
FROM employees
ORDER BY department, dept_rank;`,
        tags: ['sql', 'window-functions', 'analytics', 'ranking'],
    },
    {
        title: 'Merge Sort in JavaScript',
        language: 'javascript',
        description: 'Stable O(n log n) sorting using divide-and-conquer',
        code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}

console.log(mergeSort([38, 27, 43, 3, 9, 82, 10]));`,
        tags: ['sorting', 'algorithm', 'merge-sort', 'divide-and-conquer'],
    },
    {
        title: 'Python Fibonacci with Memoization',
        language: 'python',
        description: 'Fibonacci sequence with memoization using functools.lru_cache',
        code: `from functools import lru_cache
import time

@lru_cache(maxsize=None)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# With manual memoization
def fib_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n < 2:
        return n
    memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]

start = time.time()
print(fibonacci(50))  # 12586269025 - instant with cache
print(f"Time: {time.time() - start:.6f}s")`,
        tags: ['fibonacci', 'memoization', 'dynamic-programming', 'python'],
    },
    {
        title: 'React useReducer Complex State',
        language: 'javascript',
        description: 'Managing complex form state with useReducer hook',
        code: `import { useReducer } from 'react';

const initialState = {
  name: '', email: '', password: '',
  errors: {}, isSubmitting: false,
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value,
               errors: { ...state.errors, [action.field]: '' } };
    case 'SET_ERROR':
      return { ...state, errors: { ...state.errors, [action.field]: action.message } };
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true };
    case 'SUBMIT_SUCCESS':
      return { ...initialState };
    case 'SUBMIT_FAIL':
      return { ...state, isSubmitting: false };
    default:
      return state;
  }
}

function SignupForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const handleChange = (e) =>
    dispatch({ type: 'SET_FIELD', field: e.target.name, value: e.target.value });
  // ... render
}`,
        tags: ['react', 'useReducer', 'state-management', 'forms'],
    },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/code-snippets');
        console.log('✅ Connected to MongoDB');

        // Ensure indexes match the latest schema definition (including
        // text index language settings) before inserting documents.
        await Snippet.syncIndexes();
        console.log('🧾 Synced indexes for Snippet collection');

        await Snippet.deleteMany({});
        console.log('🗑️  Cleared existing snippets');

        const inserted = await Snippet.insertMany(snippets);
        console.log(`✅ Seeded ${inserted.length} code snippets`);

        // Verify text index exists
        const indexes = await Snippet.collection.indexes();
        const textIndex = indexes.find((idx) => idx.name === 'snippet_text_index');
        console.log(`📑 Text index: ${textIndex ? '✅ exists' : '❌ not found'}`);

        await mongoose.disconnect();
        console.log('🎉 Seeding complete!');
    } catch (error) {
        console.error('❌ Seed error:', error.message);
        process.exit(1);
    }
}

seed();
