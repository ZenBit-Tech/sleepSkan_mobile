import { IProfile } from 'src/models';

export const getScore = (profile: IProfile) => {
    const calculateAge = (dob: string): number => {
        const birthDate = new Date(dob);
        const now = new Date();
        let age = now.getFullYear() - birthDate.getFullYear();

        if (
          now.getMonth() < birthDate.getMonth() ||
          (now.getMonth() === birthDate.getMonth() && now.getDate() < birthDate.getDate())
        ) {
          age--;
        }

        return age;
      };

    const BMI = profile.weight && profile.height ? profile.weight / (profile.height * profile.height) : 0;
 
    const score =
      (profile.gender === 'male' ? 1 : 0) +
      (calculateAge(profile.dob as string) >= 50 ? 1 : 0) +
      (BMI > 35 ? 1 : 0) +
      (profile.tired ? 1 : 0) +
      (profile.loud_snore ? 1 : 0) +
      (profile.blood_pressure ? 1 : 0) +
      (profile.stop_breathing ? 1 : 0) +
      ((profile.neck_size && profile.neck_size > 40) ? 1 : 0);

    return {BMI, score};
  };
