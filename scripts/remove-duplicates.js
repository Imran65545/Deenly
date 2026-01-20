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
        console.log(`Index ${d.index} (first at ${d.firstSeenAt}):`);
        console.log(`Q: ${d.question}`);
        console.log('---\n');
    });

    // Create a cleaned version without duplicates
    const indicesToRemove = new Set(duplicates.map(d => d.index));
    const cleaned = data.filter((q, idx) => !indicesToRemove.has(idx));

    console.log(`Removing ${duplicates.length} duplicates...`);
    console.log(`New total: ${cleaned.length} questions\n`);

    // Save the cleaned version
    fs.writeFileSync(questionsPath, JSON.stringify(cleaned, null, 4));
    console.log('✅ Duplicates removed successfully!');
    console.log(`📊 Final count: ${cleaned.length} unique questions`);
} else {
    console.log('\n✅ No duplicates found!');
}
