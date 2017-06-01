import { names, surnames } from './nameCollection';

export default function nameGenerator() {
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];
  return `${randomName} ${randomSurname}`;
}
