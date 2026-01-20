const fs = require('fs');
const path = require('path');

// Read the questions file
const questionsPath = path.join(__dirname, '..', 'data', 'questions.json');
const data = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

const seen = new Map();
const duplicates = [];

data.forEach((q, idx) => {
    const key = q.question.toLowerCase().trim();
    if (seen.has(key)) {
        duplicates.push({
            index: idx,
            question: q.question,
            firstSeenAt: seen.get(key)
        });
    } else {
        seen.set(key, idx);
    }
});

console.log('Total questions:', data.length);
console.log('Duplicate questions found:', duplicates.length);

if (duplicates.length > 0) {
    console.log('\n=== DUPLICATES FOUND ===\n');
    duplicates.forEach(d => {
        console.log(`Duplicate at index ${d.index} (first seen at index ${d.firstSeenAt}):`);
        console.log(`Q: ${d.question}`);
        console.log('---');
    });

    // Create a cleaned version without duplicates
    const indicesToRemove = new Set(duplicates.map(d => d.index));
    const cleaned = data.filter((q, idx) => !indicesToRemove.has(idx));

    console.log(`\nWould remove ${duplicates.length} duplicates`);
    console.log(`New total would be: ${cleaned.length} questions`);

    // Save the cleaned version
    const cleanedPath = path.join(__dirname, '..', 'data', 'questions_cleaned.json');
    fs.writeFileSync(cleanedPath, JSON.stringify(cleaned, null, 4));
    console.log(`\nCleaned version saved to: ${cleanedPath}`);
} else {
    console.log('\n✅ No duplicates found!');
}
