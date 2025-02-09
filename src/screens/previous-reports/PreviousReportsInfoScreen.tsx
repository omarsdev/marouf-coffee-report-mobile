import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ContainerComponents from '@/components/container/ContainerComponents';
import HeaderComponents from '@/components/HeaderComponents';
import CustomLoadingProvider from '@/components/custom/CustomLoadingProvider';
import {useQuery} from '@tanstack/react-query';
import {assignmentsAPI} from '@/api/assignments';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {twMerge} from 'tailwind-merge';
import {normalize} from '@/utils';
import {submissionsAPI} from '@/api/submissions';
import CustomButton from '@/components/custom/CustomButton';
import BottomSheet from '@gorhom/bottom-sheet';
import ViewNoteComponent from '../report/components/ViewNoteComponent';

const TASKS_COLORS = [
  {bg: 'bg-[#FFF5D5]', btn: 'bg-[#F9E5A3]'},
  {bg: 'bg-[#A8D0E680]', btn: 'bg-[#A8D0E6]'},
  {bg: 'bg-[#D3A9E380]', btn: 'bg-[#D3A9E3]'},
  {bg: 'bg-[#B9E0D480]', btn: 'bg-[#B9E0D4]'},
];

const PreviousReportsInfoScreen = () => {
  const navigation = useNavigation();
  const {params} = useRoute();
  const isFocused = useIsFocused();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const [selectedNote, setSelectedNote] = useState(null);

  const {data, isLoading} = useQuery({
    queryFn: () => assignmentsAPI.getById(params?.assignmentId),
    queryKey: ['reportsById' + params?.assignmentId],
    subscribed: isFocused,
  });

  const {data: submissionReports, isLoading: submissionReportsLoading} =
    useQuery({
      queryFn: () =>
        submissionsAPI.getByReportId(data?.assignment?.reportId?._id),
      queryKey: ['submissionsByReport' + data?.assignment?.reportId?._id],
      subscribed: isFocused,
      enabled: !!data?.assignment?.reportId?._id,
    });

  useEffect(() => {
    if (selectedNote) {
      bottomSheetRef.current?.expand();
    }
  }, [selectedNote]);

  return (
    <SafeAreaView className="flex-1">
      <ContainerComponents>
        <HeaderComponents />
        <CustomLoadingProvider loading={isLoading || submissionReportsLoading}>
          <Text className="my-7 font-poppins text-2xl font-normal leading-9 text-left">
            {data?.assignment?.reportId?.title}
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-1 gap-4">
              {data?.assignment?.reportId?.questions?.map(
                (question, questionIndex) => {
                  const {bg, btn} = TASKS_COLORS[questionIndex % 2];
                  const questionAnswer =
                    submissionReports?.submissions?.[0]?.answers?.find(
                      e => e?.questionId === question?._id,
                    );
                  const {answer, note} = questionAnswer || {};

                  return (
                    <View
                      className={twMerge(
                        'py-4 px-2 flex-col justify-between rounded-xl',
                        bg,
                        answer && 'border-[1px]',
                      )}
                      key={questionIndex}>
                      <Text className="font-poppins text-lg font-normal leading-6 text-left">
                        {question?.text}
                      </Text>
                      <View className="flex-row gap-5 justify-end mt-3">
                        <View
                          // onPress={() => onCreate('Yes', question)}
                          className={twMerge(
                            'px-3 py-[6px] rounded-3xl',
                            btn,
                            answer === 'Yes' && 'border-[1px]',
                          )}>
                          <Text
                            className="font-poppins font-normal"
                            style={{fontSize: normalize(16)}}>
                            Yes
                          </Text>
                        </View>
                        <View
                          // onPress={() => onCreate('No', question)}
                          className={twMerge(
                            'bg-[#F9A3A3] px-3 py-[6px] rounded-3xl',
                            answer === 'No' && 'border-[1px]',
                          )}>
                          <Text
                            className="font-poppins font-normal"
                            style={{fontSize: normalize(16)}}>
                            No
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedNote({question, questionAnswer});
                          }}
                          className={twMerge(
                            'px-3 py-[6px] rounded-3xl',
                            btn,
                            note !== 'Empty' && 'border-[1px]',
                          )}>
                          <Text
                            className="font-poppins font-normal"
                            style={{fontSize: normalize(16)}}>
                            Note
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                },
              )}
            </View>
          </ScrollView>
          <CustomButton
            title="Back"
            onPress={navigation.goBack}
            className="mt-2"
          />
        </CustomLoadingProvider>
      </ContainerComponents>
      <ViewNoteComponent
        ref={bottomSheetRef}
        selectedNote={selectedNote}
        setSelectedNote={setSelectedNote}
      />
    </SafeAreaView>
  );
};

export default PreviousReportsInfoScreen;
