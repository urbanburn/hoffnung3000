export default {
  common: {
    agreeWithTerms: 'I agree with the terms',
    emptyList: 'Nothing to do here yet ...',
    nextStep: 'Next step',
    payViaPayPal: 'Pay via PayPal',
    payViaTransfer: 'Pay via transfer',
    previousStep: 'Previous step',
  },
  navigationLinks: {
    about: 'About',
    admin: 'Admin',
    calendar: 'Calendar',
    contact: 'Contact',
    home: 'Home',
    information: 'Information',
    resources: 'Der Markt',
    places: 'Places',
    tickets: 'Tickets',
  },
  staticPage: {
    errorTitle: '404',
    errorText: 'Oups. The requested page does not exist. Please check the url again or contact us.',
  },
  ticketWizard: {
    stepTitle: 'Get a festival ticket (Step {currentStep} of {totalSteps})',
  },
  locationSelector: {
    addressMode: 'Regular address',
    city: 'City',
    cityCode: 'City code',
    clickMap: 'Click on the map to mark a position for your place.',
    country: 'Country',
    currentGpsPosition: 'Selected position (latitude and longitude)',
    gpsPositionMode: 'GPS position',
    street: 'Street + Number',
    virtualMode: 'Virtual space',
    yourPlacePosition: 'The position of your place',
  },
  registrationWizard: {
    stepTitle: 'Registration (Step {currentStep} of {totalSteps})',
  },
  sidebar: {
    activityButton: 'All activites',
    activityTitle: 'Recent activities',
    comingSoon: 'Coming soon!',
    defaultHeader: '<p>Welcome dear visitor,</p><p>please <em>register</em> or <em>login</em> below to use the platform.</p>',
    gifDocumentationTitle: '.gif-documentation',
    inboxButton: { one: 'Inbox ({count})', zero: 'Inbox', other: 'Inbox ({count})' },
    loginButton: 'Login',
    loginHeader: 'Already have a login?',
    logoutButton: 'Logout',
    profileButton: 'Profile',
    randomMeetingTitle: 'Random meetings',
    randomMeetingDescription: 'Randomly meet other participants at a random place today',
    signUpButton: 'Register as participant',
    signUpHeader: 'We invite all activists, artists, theoreticians, performers, musicians, hackers and everyone else to register.',
    startDocumentationButton: 'Start documentation',
    visitorButton: 'Buy an audience ticket',
    visitorHeader: 'Or buy an audience ticket to visit the festival.',
    welcomeUser: '<p>Hi {firstname},</p><p>Big massive welcome to the platform!</p>',
  },
  sidebarRandomMeeting: {
    anytime: 'Anytime',
    requestButton: 'Request random meeting',
  },
  slotEditor: {
    slotsHaveToBeInClosedOrder: 'Please select your slots in a closed order',
    submitButton: 'Okay',
    title: 'Slot editor',
  },
  slotEditorItem: {
    cantDisableBookedSlot: 'Sorry, you can\'t disable a slot which is already booked',
    slotIsBookedAlert: 'Sorry, this slot was already booked by someone else',
    slotIsDisabledAlert: 'Sorry, the owner of this place disabled this slot',
  },
  formPlaceSlotSelector: {
    loadingSlots: 'Loading slot data ...',
    selectAPlaceFirst: 'Please select a place first!',
    when: 'When?',
    where: 'Where?',
  },
  slotSizeEditor: {
    editSlotsLabel: 'Manage available slots',
    editSlotsButton: 'Edit slots',
    slotSizeLabel: 'How long is one slot?',
  },
  placeSelector: {
    openModalButton: 'Select a place',
    submitButton: 'Close',
    title: 'Select a place',
  },
  slotSelector: {
    openModalButton: 'Select time slots',
    submitButton: 'Close',
    title: 'Select time slots',
  },
  placeListItem: {
    isPrivatePlace: 'This place is not visible to the audience',
    virtualLocation: '@ Virtual location',
  },
  formResourceSelector: {
    openModalButton: 'Select resources',
    title: 'Select resources for your event',
    submitButton: 'Okay',
  },
  formImageUploader: {
    deleteImageButton: 'Remove',
    maxImageReached: { one: 'You can only upload {count} image', zero: 'You can only upload {count} image', other: 'You can only upload {count} images' },
    uploadButton: 'Select files',
  },
  curatedSelectableListItem: {
    addItem: 'Add',
    isNotAvailable: 'Not available',
    isSelected: 'Selected',
    removeItem: 'Remove',
  },
  activityListItem: {
    activity: {
      RECEIVED_REQUEST: {
        place: 'requested your place "{objectTitle}" for the event "{eventTitle}"',
        placeDeleted: 'requested once your place "{objectTitle}" for a now deleted event',
        resource: 'requested your resource "{objectTitle}" for the event "{eventTitle}"',
        resourceDeleted: 'requested once your resource "{objectTitle}" for a now deleted event',
      },
      CREATE_OBJECT: {
        event: 'created a new event "{objectTitle}"',
        place: 'created a new place "{objectTitle}"',
        resource: 'created a new resource "{objectTitle}"',
      },
      UPDATE_OBJECT: {
        event: 'updated an event "{objectTitle}"',
        place: 'updated a place "{objectTitle}"',
        resource: 'updated a resource "{objectTitle}"',
      },
      DELETE_OBJECT: {
        event: 'deleted an event "{objectTitle}"',
        place: 'deleted a place "{objectTitle}"',
        resource: 'deleted a resource "{objectTitle}"',
      },
      RECEIVED_MESSAGE: 'sent you a message',
      JOIN_RANDOM_MEETING: 'joined your random meeting',
      JOIN_RANDOM_MEETING_ME: 'You joined a random meeting',
      CREATE_RANDOM_MEETING: 'You created a random meeting',
    },
    link: {
      event: 'See event',
      message: 'Go to INBOX',
      place: 'See place',
      resource: 'Go to DER MARKT',
    },
    someone: 'Someone',
    wasDeleted: 'which was deleted',
  },
  footer: {
    about: 'About',
    contact: 'Contact',
    home: 'Home',
    imprint: 'Imprint',
    information: 'Information',
    supportedBy: 'Supported by',
  },
}
