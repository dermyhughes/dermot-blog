---
title: "Unlocking the Power of Compound Components in React"
publishedAt: "2024-08-08T20:33:47.000+01:00"
updatedAt: "2025-01-06T21:34:03.000+00:00"
tags: ["blog"]
primaryTag: "blog"
primaryTagLabel: "Blog"
excerpt: "One of the patterns that can significantly improve our codebase is the Compound Component pattern. Today, we're diving deep into how this pattern works, the problems it solves, and some advanced techniques."
featured: false
featureImage: "ghost-1785628038333-unlocking-the-power-of-compound-components.jpg"
---

<p>If you've been working with React for a while, you've probably encountered the need for creating reusable and maintainable UI components. One of the patterns that can significantly improve our codebase is the Compound Component pattern. Today, we're diving deep into how this pattern works, the problems it solves, and some advanced techniques to make our components even more powerful.</p><p><em>Before we dive in, a quick note on accessibility: It’s crucial to keep accessibility in mind when building components. While we’ll keep things simple for clarity, always ensure your components are accessible in real-world applications.</em></p><hr><h2 id="why-the-compound-component-pattern">Why the Compound Component Pattern?</h2><h3 id="1-prop-drilling">1. Prop Drilling</h3><p>Imagine you have a parent component that needs to pass data down to a deeply nested child component. To do this, you have to pass the data through every layer in between, which can quickly become messy and hard to manage. This is known as "prop drilling," and it's a common headache in React. The Compound Component pattern helps us avoid this by allowing child components to communicate directly with their parent, without needing to pass props through every intermediate layer.</p><h3 id="2-component-configuration">2. Component Configuration</h3><p>As your components grow more complex, managing configurations through props can become cumbersome. You might find yourself with a component that has a dozen or more props, making it difficult to use and maintain. The Compound Component pattern provides a more intuitive and flexible way to configure components by letting related components "talk" to each other directly.</p><h3 id="3-reusability-and-composability">3. Reusability and Composability</h3><p>This pattern is fantastic for promoting reusability and composability. It lets us build components that fit together like Lego bricks, leading to cleaner and more maintainable code.</p><hr><h2 id="features-of-compound-components">Features of Compound Components</h2><h3 id="1-context-api-usage">1. Context API Usage</h3><p>The first tool in our toolbox is React's <a href="https://react.dev/learn/passing-data-deeply-with-context">Context API.</a> Think of it as a way to create a shared space where components can store and access data, without needing to pass it explicitly through props. This shared space is known as "context," and it helps keep our component hierarchy clean by avoiding prop drilling.</p><h3 id="2-clean-and-intuitive-api">2. Clean and Intuitive API</h3><p>By using compound components, we can expose a clean and intuitive API. This means that other developers (or future you) can easily understand how to use your components without having to dig into the implementation details.</p><h3 id="3-flexibility-in-composition">3. Flexibility in Composition</h3><p>This pattern allows us to define child components within the parent component, giving us flexibility in composition. It makes customizing and extending components a breeze.</p><hr><h2 id="implementing-compound-components-a-practical-example">Implementing Compound Components: A Practical Example</h2><p>Let's kick things off by creating a simple <code>Tabs</code> component using the Compound Component pattern.</p><h3 id="step-1-define-the-context">Step 1: Define the Context</h3><p>First, we need a way for our components to share data without passing props through every level of the component tree. This is where React’s Context API comes in.</p><p>Here’s how it works: We create a context, which is like a global object that can store data. Any component inside this context can access the data without needing props. We’ll also create a provider component (<code>TabsProvider</code>) that wraps our context and provides the data to any child component that needs it.</p><pre><code class="language-jsx">import React, { createContext, useState, useContext } from 'react';

const TabsContext = createContext();

const TabsProvider = ({ children }) =&gt; {
  const [activeTab, setActiveTab] = useState(0);

  const value = {
    activeTab,
    setActiveTab,
  };

  return (
    &lt;TabsContext.Provider value={value}&gt;
      {children}
    &lt;/TabsContext.Provider&gt;
  );
};

const useTabsContext = () =&gt; {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabsContext must be used within a TabsProvider');
  }
  return context;
};</code></pre><h3 id="what-did-we-just-do"><strong>What did we just do?</strong></h3><ul><li>We created a <code>TabsContext</code> that will hold the shared state.</li><li>We made a <code>TabsProvider</code> component that wraps its children and gives them access to this context.</li><li>Finally, we wrote a <code>useTabsContext</code> hook, which is just a convenient way to access the context in our components.</li></ul><h3 id="step-2-create-the-compound-components"><br>Step 2: Create the Compound Components</h3><p>Now that we have our context set up, let’s create the actual <code>Tabs</code> components. We’ll start with a parent <code>Tabs</code> component, which will use our <code>TabsProvider</code> to wrap everything. Then, we’ll create <code>TabList</code>, <code>Tab</code>, and <code>TabPanel</code> components.</p><pre><code class="language-jsx">const Tabs = ({ children }) =&gt; {
  return &lt;TabsProvider&gt;{children}&lt;/TabsProvider&gt;;
};

const TabList = ({ children }) =&gt; {
  return &lt;div role="tablist" className="tab-list"&gt;{children}&lt;/div&gt;;
};

const Tab = ({ children, index }) =&gt; {
  const { activeTab, setActiveTab } = useTabsContext();

  return (
    &lt;button
      role="tab"
      aria-selected={activeTab === index}
      className={\`tab \${activeTab === index ? 'active' : ''}\`}
      onClick={() =&gt; setActiveTab(index)}
    &gt;
      {children}
    &lt;/button&gt;
  );
};

const TabPanel = ({ children, index }) =&gt; {
  const { activeTab } = useTabsContext();

  return activeTab === index ? (
    &lt;div role="tabpanel" className="tab-panel"&gt;{children}&lt;/div&gt;
  ) : null;
};</code></pre><h3 id="what-did-we-just-do-1"><strong>What did we just do?</strong></h3><ul><li>The <code>Tabs</code> component wraps its children with <code>TabsProvider</code>, giving them access to the context.</li><li>The <code>TabList</code> component serves as a container for the tabs.</li><li>The <code>Tab</code> component uses the context to determine if it’s the active tab and updates the active tab when clicked.</li><li>The <code>TabPanel</code> component displays content only when its corresponding tab is active.</li></ul><p>Notice that we’re using standard HTML roles like <code>tab</code>, <code>tablist</code>, and <code>tabpanel</code> to make our components more accessible. This is a good practice to follow when building real-world applications.</p><h3 id="step-3-compose-the-components">Step 3: Compose the Components</h3><p>Let’s put everything together to create a working <code>Tabs</code> interface.</p><pre><code class="language-jsx">const App = () =&gt; {
  return (
    &lt;Tabs&gt;
      &lt;TabList&gt;
        &lt;Tab index={0}&gt;Tab 1&lt;/Tab&gt;
        &lt;Tab index={1}&gt;Tab 2&lt;/Tab&gt;
        &lt;Tab index={2}&gt;Tab 3&lt;/Tab&gt;
      &lt;/TabList&gt;
      &lt;TabPanel index={0}&gt;Content for Tab 1&lt;/TabPanel&gt;
      &lt;TabPanel index={1}&gt;Content for Tab 2&lt;/TabPanel&gt;
      &lt;TabPanel index={2}&gt;Content for Tab 3&lt;/TabPanel&gt;
    &lt;/Tabs&gt;
  );
};

export default App;</code></pre><h2 id="handling-different-states-conditionally">Handling Different States Conditionally</h2><p>Next, let’s build a file dropzone component that handles different states, like accepting or rejecting a file. This is a great example of using the Compound Component pattern to conditionally render content based on internal state.</p><p>But first, let's introduce a slightly different way of organising our compound components: using dot notation.</p><h3 id="step-1-define-the-context-1">Step 1: Define the Context</h3><p>Just like before, we’ll start by creating a context to manage the dropzone’s state.</p><pre><code class="language-jsx">import React, { createContext, useContext, useState } from 'react';

const DropzoneContext = createContext();

const DropzoneProvider = ({ children, state }) =&gt; {
  const value = { state };
  return &lt;DropzoneContext.Provider value={value}&gt;{children}&lt;/DropzoneContext.Provider&gt;;
};

const useDropzoneContext = () =&gt; {
  const context = useContext(DropzoneContext);
  if (!context) {
    throw new Error('useDropzoneContext must be used within a DropzoneProvider');
  }
  return context;
};</code></pre><h3 id="step-2-create-the-compound-components-with-dot-notation">Step 2: Create the Compound Components with dot notation</h3><p>Here’s where things get interesting. Instead of having separate components like <code>Tab</code> and <code>TabList</code>, we’re going to use dot notation to organize our dropzone components under a single <code>Dropzone</code> namespace. This makes it clear that these components are related and intended to be used together.</p><pre><code class="language-jsx">const Dropzone = ({ children, state }) =&gt; {
  return &lt;DropzoneProvider state={state}&gt;{children}&lt;/DropzoneProvider&gt;;
};

Dropzone.Accept = ({ children }) =&gt; {
  const { state } = useDropzoneContext();
  return state === 'accept' ? &lt;div className="dropzone-accept"&gt;{children}&lt;/div&gt; : null;
};

Dropzone.Reject = ({ children }) =&gt; {
  const { state } = useDropzoneContext();
  return state === 'reject' ? &lt;div className="dropzone-reject"&gt;{children}&lt;/div&gt; : null;
};

Dropzone.Idle = ({ children }) =&gt; {
  const { state } = useDropzoneContext();
  return state === 'idle' ? &lt;div className="dropzone-idle"&gt;{children}&lt;/div&gt; : null;
};

Dropzone.Disabled = ({ children }) =&gt; {
  const { state } = useDropzoneContext();
  return state === 'disabled' ? &lt;div className="dropzone-disabled"&gt;{children}&lt;/div&gt; : null;
};</code></pre><p>Dot notation helps keep related components organized under a single namespace (<code>Dropzone</code>). It makes the API cleaner and avoids potential naming conflicts since all related components are grouped together.</p><p>You only need to import the entire parent component (e.g., <code>Dropzone</code>) to access any of its sub-components, which depending on how you look at it, could be a benefit or a downside. Everything comes with the component without needing to individually import sub-components, but it does increase the bundle size.</p><h3 id="step-3-use-the-dropzone-component">Step 3: Use the Dropzone Component</h3><p>Now let’s see how we can use this <code>Dropzone</code> component in our app.</p><pre><code class="language-jsx">const App = () =&gt; {
  const [dropzoneState, setDropzoneState] = useState('idle');

  return (
    &lt;div&gt;
      &lt;button onClick={() =&gt; setDropzoneState('accept')}&gt;Accept&lt;/button&gt;
      &lt;button onClick={() =&gt; setDropzoneState('reject')}&gt;Reject&lt;/button&gt;
      &lt;button onClick={() =&gt; setDropzoneState('idle')}&gt;Idle&lt;/button&gt;
      &lt;button onClick={() =&gt; setDropzoneState('disabled')}&gt;Disabled&lt;/button&gt;

      &lt;Dropzone state={dropzoneState}&gt;
        &lt;Dropzone.Accept&gt;File accepted! 😊&lt;/Dropzone.Accept&gt;
        &lt;Dropzone.Reject&gt;File rejected! 😢&lt;/Dropzone.Reject&gt;
        &lt;Dropzone.Idle&gt;Drag a file here or click to upload.&lt;/Dropzone.Idle&gt;
        &lt;Dropzone.Disabled&gt;Dropzone is disabled. 🚫&lt;/Dropzone.Disabled&gt;
      &lt;/Dropzone&gt;
    &lt;/div&gt;
  );
};

export default App;</code></pre><h2 id="advanced-techniques-and-tips">Advanced Techniques and Tips</h2><h3 id="1-default-props">1. Default Props</h3><p>Sometimes, you want to provide a sensible default for your components, but still allow users to customize them if they need to. This makes your components more flexible. For example, you can set a default active tab but still let users override it if they want.</p><pre><code class="language-jsx">const Tabs = ({ children, defaultTab = 0 }) =&gt; {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return &lt;TabsProvider value={{ activeTab, setActiveTab }}&gt;{children}&lt;/TabsProvider&gt;;
};</code></pre><h3 id="2-custom-hooks-for-context">2. Custom Hooks for Context</h3><p>Creating custom hooks for context logic can simplify usage and improve readability. Checking for context and returning an error can improve the Developer Experience for users.</p><pre><code class="language-jsx">const useTabs = () =&gt; {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a TabsProvider');
  }
  return context;
};</code></pre><h3 id="3-dynamic-component-composition">3. Dynamic Component Composition</h3><p>We can dynamically compose compound components based on certain conditions, such as layout direction.</p><pre><code class="language-jsx">const Tabs = ({ children, vertical = false }) =&gt; {
  return &lt;div className={\`tabs \${vertical ? 'vertical' : 'horizontal'}\`}&gt;{children}&lt;/div&gt;;
};</code></pre><h3 id="4-enhanced-composition-with-render-props">4. Enhanced Composition with Render Props</h3><p>Render props give you a super flexible way to control how your components are rendered. Instead of just passing static content, you can pass a function that returns whatever content you want. This gives you more control over the behavior of your components.</p><pre><code class="language-jsx">const Tabs = ({ children, defaultTab = 0 }) =&gt; {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    &lt;TabsContext.Provider value={{ activeTab, setActiveTab }}&gt;
      {typeof children === 'function' ? children({ activeTab, setActiveTab }) : children}
    &lt;/TabsContext.Provider&gt;
  );
};</code></pre><h3 id="5-typescript-integration">5. TypeScript Integration</h3><p>Integrating type definitions can enhance our development experience.</p><pre><code class="language-tsx">interface TabsContextProps {
  activeTab: number;
  setActiveTab: (index: number) =&gt; void;
}

const TabsContext = createContext&lt;TabsContextProps | undefined&gt;(undefined);</code></pre><h2 id="real-world-example-multi-step-wizard-form">Real-World Example: Multi-Step Wizard Form</h2><p>Let's combine everything we've learned to create a multi-step wizard form.</p><h3 id="step-1-define-the-context-2">Step 1: Define the Context</h3><pre><code class="language-jsx">import React, { createContext, useContext, useState, useEffect } from 'react';

const WizardContext = createContext();

const WizardProvider = ({ children, initialStep = 0 }) =&gt; {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isStepValid, setIsStepValid] = useState(true);

  const nextStep = () =&gt; isStepValid &amp;&amp; setCurrentStep((prev) =&gt; prev + 1);
  const prevStep = () =&gt; setCurrentStep((prev) =&gt; Math.max(prev - 1, 0));
  const validateStep = (isValid) =&gt; setIsStepValid(isValid);

  const value = { currentStep, nextStep, prevStep, validateStep };
  return &lt;WizardContext.Provider value={value}&gt;{children}&lt;/WizardContext.Provider&gt;;
};

const useWizardContext = () =&gt; {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizardContext must be used within a WizardProvider');
  }
  return context;
};</code></pre><h3 id="step-2-create-the-compound-components-1">Step 2: Create the Compound Components</h3><pre><code class="language-jsx">const Wizard = ({ children, initialStep }) =&gt; {
  return &lt;WizardProvider initialStep={initialStep}&gt;{children}&lt;/WizardProvider&gt;;
};

Wizard.Step = ({ children, stepIndex, validate }) =&gt; {
  const { currentStep, validateStep } = useWizardContext();

  useEffect(() =&gt; {
    if (validate) {
      validateStep(validate());
    }
  }, [currentStep, validate, validateStep]);

  return currentStep === stepIndex ? &lt;div className="wizard-step"&gt;{children}&lt;/div&gt; : null;
};

Wizard.Navigation = () =&gt; {
  const { currentStep, nextStep, prevStep } = useWizardContext();
  return (
    &lt;div className="wizard-navigation"&gt;
      &lt;button onClick={prevStep} disabled={currentStep === 0}&gt;Back&lt;/button&gt;
      &lt;button onClick={nextStep}&gt;Next&lt;/button&gt;
    &lt;/div&gt;
  );
};

Wizard.Summary = ({ children }) =&gt; {
  const { currentStep } = useWizardContext();
  return currentStep === -1 ? &lt;div className="wizard-summary"&gt;{children}&lt;/div&gt; : null;
};</code></pre><h3 id="step-3-use-the-wizard-component">Step 3: Use the Wizard Component</h3><pre><code class="language-jsx">const App = () =&gt; {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: ''
  });

  const handleChange = (e) =&gt; {
    const { name, value } = e.target;
    setFormData((prev) =&gt; ({ ...prev, [name]: value }));
  };

  return (
    &lt;Wizard initialStep={0}&gt;
      &lt;Wizard.Step stepIndex={0} validate={() =&gt; formData.name !== ''}&gt;
        &lt;h2&gt;Step 1: Basic Information&lt;/h2&gt;
        &lt;label&gt;
          Name:
          &lt;input type="text" name="name" value={formData.name} onChange={handleChange} /&gt;
        &lt;/label&gt;
      &lt;/Wizard.Step&gt;

      &lt;Wizard.Step stepIndex={1} validate={() =&gt; formData.email !== ''}&gt;
        &lt;h2&gt;Step 2: Contact Information&lt;/h2&gt;
        &lt;label&gt;
          Email:
          &lt;input type="email" name="email" value={formData.email} onChange={handleChange} /&gt;
        &lt;/label&gt;
      &lt;/Wizard.Step&gt;

      &lt;Wizard.Step stepIndex={2} validate={() =&gt; formData.address !== ''}&gt;
        &lt;h2&gt;Step 3: Address Information&lt;/h2&gt;
        &lt;label&gt;
          Address:
          &lt;input type="text" name="address" value={formData.address} onChange={handleChange} /&gt;
        &lt;/label&gt;
      &lt;/Wizard.Step&gt;

      &lt;Wizard.Summary&gt;
        &lt;h2&gt;Summary&lt;/h2&gt;
        &lt;p&gt;Name: {formData.name}&lt;/p&gt;
        &lt;p&gt;Email: {formData.email}&lt;/p&gt;
        &lt;p&gt;Address: {formData.address}&lt;/p&gt;
      &lt;/Wizard.Summary&gt;

      &lt;Wizard.Navigation /&gt;
    &lt;/Wizard&gt;
  );
};

export default App;</code></pre><h2 id="conclusion">Conclusion</h2><p>We've just explored how the Compound Component pattern in React can be a game-changer for building complex, state-driven UIs. By leveraging context and modular sub-components, we can create flexible, maintainable, and intuitive interfaces. This approach ensures clean separation of concerns, easy state management, and dynamic, conditional rendering based on internal state. Whether we're building tabs, dropzones, or multi-step forms, experimenting with these advanced techniques can greatly enhance the functionality and user experience of our React applications. And remember, always keep accessibility in mind!</p>
