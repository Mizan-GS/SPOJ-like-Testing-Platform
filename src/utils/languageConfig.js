export const languageConfig = {
  javascript: {
    label: "JavaScript",
    monaco: "javascript",
    boilerplate: `function solve() {
  
}`,
  },

  python: {
    label: "Python",
    monaco: "python",
    boilerplate: `def solve():
    pass
`,
  },

  c: {
    label: "C",
    monaco: "c",
    boilerplate: `#include <stdio.h>

   int main() {
    // your code here
    return 0;
}
`,
  },

  cpp: {
    label: "C++",
    monaco: "cpp",
    boilerplate: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // your code here
    return 0;
}
`,
  },

  java: {
    label: "Java",
    monaco: "java",
    boilerplate: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // your code here
    }
}
`,
  },

  rust: {
    label: "Rust",
    monaco: "rust",
    boilerplate: `use std::io;

fn main() {
    // your code here
}
`,
  },

  go: {
    label: "Go",
    monaco: "go",
    boilerplate: `package main

import "fmt"

func main() {
    // your code here
    fmt.Println("")
}
`,
  },
};
